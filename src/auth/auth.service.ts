import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { SigninDto } from './dto/signin.dto';
import { BCryptService } from 'src/common/utils/bcrypt.service';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { AccessTokenPayload } from './dto/access-token.payload';
import { TokenService } from 'src/common/utils/token.service';
import { CommonType } from 'src/common/enum/common.type';
import { Response } from 'express';
import { RefreshTokenPayload } from './dto/refresh-token.payload';
import { RedisRepository } from 'src/common/utils/redis.repository';
import { TokenType } from 'src/common/enum/token-type.enum';
import { RedisPrefix } from 'src/common/enum/redis-prefix.enum';
import { RedisTTL } from 'src/common/enum/redis-ttl.enum';
import { generateRandomCode } from 'src/common/utils/generate-random-code';
import { MailingService } from 'src/mailing/mailing.service';

const cookieOptions = {
  sameSite: 'none' as const,
  httpOnly: true,
  secure: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BCryptService,
    private readonly tokenService: TokenService,
    private readonly redisRepository: RedisRepository,
    private readonly mailingService: MailingService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    await this.userService.checkDuplicatedUsername(signupDto.username);
    await this.userService.checkDuplicatedNickname(signupDto.nickname);

    const encrypted: string = await this.bcryptService.encrypt(signupDto.password);
    const user: User = new User(encrypted, signupDto);
    await this.userService.save(user);
  }

  async generateVerificationCode(email: string) {
    const vCode = generateRandomCode(6, 'n');
    this.redisRepository.set(`${RedisPrefix.EMAIL_N_VERIFICATED}:${email}`, vCode, RedisTTL.TTL_MIN * 5);
    this.mailingService.sendVerificationCode(email, vCode);
  }

  async checkVerificationCode(email: string, code: string) {
    const vCode = await this.redisRepository.get(`${RedisPrefix.EMAIL_N_VERIFICATED}:${email}`);
    if (!vCode) throw new BadRequestException('verification code is expired');
    if (vCode !== code) throw new BadRequestException('wrong verification code');

    this.redisRepository.del([`${RedisPrefix.EMAIL_N_VERIFICATED}:${email}`]);
    this.redisRepository.set(`${RedisPrefix.EMAIL_VERIFICATED}:${email}`, 1, RedisTTL.TTL_HOUR); // 이후 회원가입 시 삭제
  }

  async signin(body: SigninDto): Promise<string[]> {
    const user: User = await this.userService.findByUsername(body.username);
    if (!user) throw new BadRequestException('회원가입을 먼저 해주세요');
    const isMatched = await this.bcryptService.match(body.password, user.password);
    if (!isMatched) throw new BadRequestException('비밀번호를 확인해주세요');

    const accessPayload: AccessTokenPayload = new AccessTokenPayload(user.id, user.nickname);
    const refreshPayload: RefreshTokenPayload = new RefreshTokenPayload(user.id);

    const accessToken = await this.tokenService.sign(accessPayload, CommonType.TTL_HOUR);
    const refreshToken = await this.tokenService.sign(refreshPayload, CommonType.TTL_DAY * 7);

    await this.redisRepository.set(`${RedisPrefix.REFRESH_TOKEN}:${user.id}`, refreshToken, RedisTTL.TTL_DAY * 7);

    return [accessToken, refreshToken];
  }

  async signout(user: User) {
    await this.redisRepository.del([`${RedisPrefix.REFRESH_TOKEN}:${user.id}`]);
  }

  async withdraw(userId: string) {
    await this.userService.withdraw(userId);
  }

  async renewToken(user: User): Promise<string[]> {
    const accessPayload: AccessTokenPayload = new AccessTokenPayload(user.id, user.nickname);
    const refreshPayload: RefreshTokenPayload = new RefreshTokenPayload(user.id);

    const accessToken: string = await this.tokenService.sign(accessPayload, CommonType.TTL_HOUR);
    const refreshToken: string = await this.tokenService.sign(refreshPayload, CommonType.TTL_DAY * 7);

    await this.redisRepository.set(`${RedisPrefix.REFRESH_TOKEN}:${user.id}`, refreshToken, RedisTTL.TTL_DAY * 7);
    return [accessToken, refreshToken];
  }

  async renewPassword(uuid: string, plainPw: string) {
    const encrypted = await this.bcryptService.encrypt(plainPw);

    await this.redisRepository.del([`${RedisPrefix.REFRESH_TOKEN}:${uuid}`]);
    await this.userService.renewal(uuid, encrypted);
  }

  async setSteamUidToRedis(steamid: string) {
    await this.redisRepository.set(`${RedisPrefix.STEAM}:${steamid}`, 0, RedisTTL.TTL_MIN * 5);
  }

  addCookie(res: Response, key: string, val: string, ttlSec: number) {
    res.cookie(key, `${TokenType.TYPE} ${val}`, { ...cookieOptions, maxAge: ttlSec * 1000 });
  }

  removeCookie(res: Response, key: string) {
    res.clearCookie(key);
  }
}

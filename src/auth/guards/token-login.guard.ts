import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/common/utils/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from '../dto/access-token.payload';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from 'src/common/metadata/skip-auth.metadata';
import { TokenType } from 'src/common/enum/token-type.enum';
import { RedisRepository } from 'src/common/utils/redis.repository';
import { CommonType } from 'src/common/constants/common.type';
import { RedisPrefix } from 'src/common/enum/redis-prefix.enum';

@Injectable()
export class TokenLoginGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
    private readonly redisRepository: RedisRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    if (request.user) return true;

    let accessToken: string = request.cookies[TokenType.ACCESS_TOKEN];
    if (!accessToken) return true;

    accessToken = accessToken.substring(TokenType.TYPE.length + 1);
    const payload: AccessTokenPayload = JSON.parse(atob(accessToken.split('.')[1]));

    try {
      // TokenType.TYPE === 'Bearer', 따라서 띄어쓰기를 포함하려면 +1 필요
      const decoded: AccessTokenPayload = await this.tokenService.verify(accessToken);
      const user: User = await this.userRepository.findOneBy({ id: decoded.id });
      request.user = user;
    } catch (err) {
      await this.redisRepository.set(`${RedisPrefix.RENEW_TOKEN}:${payload.id}`, 0, CommonType.TTL_MIN);
      throw new UnauthorizedException(err.message);
    }
    return true;
  }
}

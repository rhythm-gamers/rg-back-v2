import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisRepository } from 'src/common/utils/redis.repository';
import { RefreshTokenPayload } from '../dto/refresh-token.payload';
import { TokenService } from 'src/common/utils/token.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { TokenType } from 'src/common/enum/token-type.enum';

@Injectable()
export class RenewTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly redisRepository: RedisRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const refreshToken: string = request.body['refreshToken'];
      if (!refreshToken) throw new Error('refresth token이 필요합니다');

      const payload: RefreshTokenPayload = JSON.parse(atob(refreshToken.split('.')[1]));
      const isRenewTarget = await this.redisRepository.get(`${TokenType.RENEW_REDIS}:${payload.id}`);
      if (!isRenewTarget) throw new Error('재발급 대상이 아닙니다');

      const decoded: RefreshTokenPayload = await this.tokenService.verify(refreshToken);
      const user: User = await this.userService.findById(decoded.id);
      request.user = user;

      await this.redisRepository.del([`${TokenType.RENEW_REDIS}:${payload.id}`]);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}

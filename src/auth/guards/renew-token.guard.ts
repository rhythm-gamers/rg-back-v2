import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisRepository } from 'src/common/utils/redis.repository';
import { RefreshTokenPayload } from '../dto/refresh-token.payload';
import { TokenService } from 'src/common/utils/token.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { RedisPrefix } from 'src/common/enum/redis-prefix.enum';
import { setUserToRequest } from 'src/common/utils/user-request-handler';

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
      const redisStoredToken = await this.redisRepository.get(`${RedisPrefix.REFRESH_TOKEN}:${payload.id}`);
      if (redisStoredToken !== refreshToken) throw new Error('만료된 refresh token입니다.');

      const decoded: RefreshTokenPayload = await this.tokenService.verify(refreshToken);
      const user: User = await this.userService.findById(decoded.id);
      setUserToRequest(request, user);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}

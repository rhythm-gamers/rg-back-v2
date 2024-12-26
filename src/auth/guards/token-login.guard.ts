import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/common/utils/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from '../dto/access-token.payload';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from 'src/common/metadata/skip-auth.metadata';
import { TokenType } from 'src/common/enum/token-type.enum';
import { setUserToRequest } from 'src/common/utils/user-request-handler';

@Injectable()
export class TokenLoginGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    if (request.user) return true;

    const accessToken: string = request.cookies[TokenType.ACCESS_TOKEN];
    if (!accessToken) return true;

    try {
      // TokenType.TYPE === 'Bearer', 따라서 띄어쓰기를 포함하려면 +1 필요
      const decoded: AccessTokenPayload = await this.tokenService.verify(
        accessToken.substring(TokenType.TYPE.length + 1),
      );
      const user: User = await this.userRepository.findOneBy({ id: decoded.id });
      setUserToRequest(request, user);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
    return true;
  }
}

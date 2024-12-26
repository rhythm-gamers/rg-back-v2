import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ADMIN_KEY } from 'src/common/metadata/admin.metadata';
import { MAINTAINER_KEY } from 'src/common/metadata/maintainer.metadata';
import { SKIP_AUTH_KEY } from 'src/common/metadata/skip-auth.metadata';
import { getUserFromRequest } from 'src/common/utils/user-request-handler';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxHandler = context.getHandler();

    const skipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, ctxHandler);
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = getUserFromRequest(request);

    const isAdmin = this.reflector.get<boolean>(ADMIN_KEY, ctxHandler);
    const isMaintainer = this.reflector.get<boolean>(MAINTAINER_KEY, ctxHandler);

    const role = user.role;
    if (isAdmin && UserRole.ADMIN !== role) throw new UnauthorizedException();
    if (isMaintainer && ![UserRole.ADMIN, UserRole.MAINTAIN].includes(role)) throw new UnauthorizedException();

    return true;
  }
}

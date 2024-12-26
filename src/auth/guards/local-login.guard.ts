import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { BCryptService } from 'src/common/utils/bcrypt.service';
import { SKIP_AUTH_KEY } from 'src/common/metadata/skip-auth.metadata';
import { Repository } from 'typeorm';
import { setUserToRequest } from 'src/common/utils/user-request-handler';

@Injectable()
export class LocalLoginGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BCryptService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    if (request.user) return true;

    const { username, password } = request.body;

    if (!username || !password) return false;

    const user: User = await this.userRepository.findOneBy({ username: username });
    const isMatched = await this.bcryptService.match(password, user.password);
    if (!isMatched) return false;

    setUserToRequest(request, user);
    return true;
  }
}

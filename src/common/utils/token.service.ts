import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: object, expire: number) {
    return await this.jwtService.signAsync({ ...payload }, { expiresIn: expire });
  }

  async verify(token: string) {
    return await this.jwtService.verifyAsync(token, { ignoreExpiration: false });
  }
}

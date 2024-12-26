import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BCryptService {
  private saltRound: number;
  constructor(private readonly configService: ConfigService) {
    this.saltRound = parseInt(configService.get('AUTH_SALT_ROUND')) ?? 10;
  }

  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRound);
    return await bcrypt.hash(password, salt);
  }

  async match(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { BCryptService } from 'src/common/utils/bcrypt.service';
import { TokenService } from 'src/common/utils/token.service';
import { RedisRepository } from 'src/common/utils/redis.repository';
import { SteamService } from 'src/steam/steam.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, BCryptService, TokenService, RedisRepository, SteamService],
})
export class AuthModule {}

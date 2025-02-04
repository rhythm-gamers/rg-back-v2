import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RedisRepository } from 'src/common/utils/redis.repository';
import { S3BucketService } from 'src/common/utils/s3-bucket.service';
import { BCryptService } from 'src/common/utils/bcrypt.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { SteamModule } from 'src/steam/steam.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FirebaseModule, SteamModule],
  controllers: [UserController],
  providers: [UserService, RedisRepository, S3BucketService, BCryptService],
  exports: [UserService],
})
export class UserModule {}

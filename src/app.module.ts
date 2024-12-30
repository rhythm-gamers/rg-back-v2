import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './config/database.module';
import { RedisRepository } from './common/utils/redis.repository';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exception/exception.filter';
import { WikiModule } from './wiki/wiki.module';
import { PlateDataModule } from './plate-data/plate-data.module';
import { ProgressModule } from './progress/progress.module';
import { AssessmentModule } from './assessment/assessment.module';
import { CommunityModule } from './community/community.module';
import { FirebaseModule } from './firebase/firebase.module';
import { TaskCronModule } from './task-cron/task-cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env/.development.env'],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    WikiModule,
    PlateDataModule,
    AssessmentModule,
    ProgressModule,
    AssessmentModule,
    CommunityModule,
    FirebaseModule,
    TaskCronModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    AppService,
    RedisRepository,
  ],
})
export class AppModule {
  constructor() {}
}

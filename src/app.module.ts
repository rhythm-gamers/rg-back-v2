import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { databaseConfig } from './config/database.config';
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
import { MailingModule } from './mailing/mailing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';

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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mailerConfig,
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: winstonConfig,
    }),
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
    MailingModule,
    RabbitmqModule,
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

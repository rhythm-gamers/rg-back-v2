import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { TokenLoginGuard } from './auth/guards/token-login.guard';
import { LocalLoginGuard } from './auth/guards/local-login.guard';
import { TokenService } from './common/utils/token.service';
import { BCryptService } from './common/utils/bcrypt.service';
import { AuthorizationGuard } from './auth/guards/authorization.guard';
import { ValidationPipe } from '@nestjs/common';
import { RedisRepository } from './common/utils/redis.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalGuards(
    new TokenLoginGuard(app.get('UserRepository'), app.get(TokenService), app.get(Reflector), app.get(RedisRepository)),
    new LocalLoginGuard(app.get('UserRepository'), app.get(BCryptService), app.get(Reflector)),
    new AuthorizationGuard(app.get(Reflector)),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('/api/v2');

  app.enableCors({
    methods: 'POST,GET,PUT,PATCH,DELETE',
    credentials: true,
    origin: '*',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

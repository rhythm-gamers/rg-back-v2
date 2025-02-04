import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const databaseConfig = async (configService: ConfigService): Promise<DataSourceOptions> => ({
  type: 'mariadb',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_DATABASE'),
  synchronize: true,
  timezone: 'Z',
  entities: ['dist/**/*.entity.{ts,js}'],
  logging: true,
});

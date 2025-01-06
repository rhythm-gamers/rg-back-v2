import { utilities as winstonUtilities, WinstonModuleOptions } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

const commonFormat = ({ isProduction, isCli }: { isProduction: boolean; isCli: boolean }, appname: string) => {
  return {
    level: isProduction ? 'info' : 'silly',
    format: isProduction
      ? winston.format.simple()
      : winston.format.combine(
          winston.format.timestamp({ format: 'YYYY/MM/DD, h:mm:ss A' }),
          winston.format.ms(),
          winstonUtilities.format.nestLike(appname, {
            appName: true,
            colors: isCli,
            prettyPrint: true,
            processId: true,
          }),
        ),
  };
};

export const winstonConfig = async (configService: ConfigService): Promise<WinstonModuleOptions> => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const appName = configService.get<string>('APP_NAME');
  return {
    transports: [
      new winston.transports.Console({
        ...commonFormat({ isProduction, isCli: true }, appName),
      }),
      new winstonDaily({
        ...commonFormat({ isProduction, isCli: false }, appName),
        datePattern: 'YYYY-MM-DD',
        dirname: __dirname + '/../../logs',
        filename: '%DATE%.log',
        // maxFiles: '14d',
        // maxSize: '20m',
        zippedArchive: true,
        handleExceptions: true,
        json: true,
      }),
    ],
  };
};

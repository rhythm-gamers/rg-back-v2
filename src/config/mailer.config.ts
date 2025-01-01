import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailerConfig = async (configService: ConfigService): Promise<MailerOptions> => ({
  transport: {
    host: configService.get('MAILING_HOST'),
    port: 587,
    auth: {
      user: configService.get('MAILING_EMAIL'),
      pass: configService.get('MAILING_PASSWORD'),
    },
  },
  defaults: {
    from: '"No Reply" <no-reply@localhost>',
  },
  template: {
    dir: __dirname + '/../common/templates',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});

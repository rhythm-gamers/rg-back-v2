import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: '[리듬게이머스] 이메일 인증코드입니다.',
      template: 'verification-email',
      context: {
        code,
      },
    });
  }
}

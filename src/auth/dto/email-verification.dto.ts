import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { SendCodeDto } from './send-code.dto';

export class EmailVerificationDto extends PartialType(SendCodeDto) {
  @IsString()
  code: string;
}

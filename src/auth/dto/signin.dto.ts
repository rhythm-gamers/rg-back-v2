import { IsString, Length, Matches } from 'class-validator';
import { RenewPasswordDto } from './renew-password.dto';

export class SigninDto extends RenewPasswordDto {
  @IsString()
  @Length(1, 20, { message: 'id는 1~20자 사이입니다' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: '영문자와 숫자만 입력 가능합니다' })
  username: string;
}

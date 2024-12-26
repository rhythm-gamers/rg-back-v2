import { IsString, Length } from 'class-validator';
import { SigninDto } from './signin.dto';

export class SignupDto extends SigninDto {
  @IsString()
  @Length(1, 20, { message: '닉네임은 1~20자 사이입니다' })
  nickname: string;
}

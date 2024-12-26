import { IsString, Length } from 'class-validator';

export class RenewPasswordDto {
  @IsString()
  @Length(1, 20, { message: '비밀번호는 8~20자 사이입니다' })
  password: string;
}

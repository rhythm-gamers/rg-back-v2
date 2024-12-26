import { IsString, Length } from 'class-validator';

export class ValidateNicknameDto {
  @IsString()
  @Length(1, 20, { message: '닉네임은 1~20자 사이입니다' })
  nickname: string;
}

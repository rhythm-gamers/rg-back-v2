import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @Length(0, 1000)
  content: string;
}

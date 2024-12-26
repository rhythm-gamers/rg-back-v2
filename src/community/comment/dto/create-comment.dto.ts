import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  articleId: number;

  @IsString()
  @Length(1, 10000)
  content: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  parentId?: number;
}

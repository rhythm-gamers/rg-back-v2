import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

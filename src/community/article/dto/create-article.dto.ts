import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  boardname: string;

  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isNotice?: boolean;
}

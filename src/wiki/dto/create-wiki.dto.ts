import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateWikiDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 10000)
  content?: string;

  @IsOptional()
  @IsBoolean()
  mustRead?: boolean;
}

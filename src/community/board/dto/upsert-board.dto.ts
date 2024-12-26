import { IsOptional, IsString, Length } from 'class-validator';

export class UpsertBoardDto {
  @IsString()
  @Length(1, 20)
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  description?: string;
}

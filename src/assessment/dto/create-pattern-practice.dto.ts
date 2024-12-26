import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsObject, IsOptional, IsString, Length } from 'class-validator';
import { CreatePatternInfoDto } from 'src/pattern-info/dto/create-pattern-info.dto';

export class CreatePatternPracticeDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsIn([4, 5, 6, 8])
  keyNum: number;

  @IsString()
  @IsOptional()
  jacketSrc: string;

  @IsString()
  @IsOptional()
  noteSrc: string;

  @IsObject()
  @IsOptional()
  @Type(() => CreatePatternInfoDto)
  patternInfo: CreatePatternInfoDto;
}

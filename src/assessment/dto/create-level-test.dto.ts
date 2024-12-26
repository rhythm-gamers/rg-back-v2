import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { CreatePatternInfoDto } from 'src/pattern-info/dto/create-pattern-info.dto';

export class CreateLevelTestDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  level: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  goalRate: number;

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

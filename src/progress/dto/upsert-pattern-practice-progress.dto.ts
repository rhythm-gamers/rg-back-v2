import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class UpsertPatternPracticeProgressDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  patternPracticeId: number;
}

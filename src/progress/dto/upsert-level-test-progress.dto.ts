import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class UpsertLevelTestProgressDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  levelTestId: number;
}

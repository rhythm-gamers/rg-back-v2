import { IsEmpty, IsNumber } from 'class-validator';

export class CreatePatternInfoDto {
  @IsNumber()
  @IsEmpty()
  roll?: number;

  @IsNumber()
  @IsEmpty()
  offGrid?: number;

  @IsNumber()
  @IsEmpty()
  stairs?: number;

  @IsNumber()
  @IsEmpty()
  peak?: number;

  @IsNumber()
  @IsEmpty()
  trill?: number;

  @IsNumber()
  @IsEmpty()
  hold?: number;
}

import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateFirebaseDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsObject()
  data: any;
}

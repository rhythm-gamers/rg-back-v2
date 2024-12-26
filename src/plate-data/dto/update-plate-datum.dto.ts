import { PartialType } from '@nestjs/mapped-types';
import { CreatePlateDatumDto } from './create-plate-datum.dto';

export class UpdatePlateDatumDto extends PartialType(CreatePlateDatumDto) {}

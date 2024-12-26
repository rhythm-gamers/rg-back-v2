import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelTestDto } from './create-level-test.dto';

export class UpdateLevelTestDto extends PartialType(CreateLevelTestDto) {}

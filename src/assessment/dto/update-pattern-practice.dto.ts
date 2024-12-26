import { PartialType } from '@nestjs/mapped-types';
import { CreatePatternPracticeDto } from './create-pattern-practice.dto';

export class UpdatePatternPracticeDto extends PartialType(CreatePatternPracticeDto) {}

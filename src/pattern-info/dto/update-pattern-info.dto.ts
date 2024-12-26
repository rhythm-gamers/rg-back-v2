import { PartialType } from '@nestjs/mapped-types';
import { PatternInfo } from '../entities/pattern-info.entity';

export class UpdatePatternInfoDto extends PartialType(PatternInfo) {}

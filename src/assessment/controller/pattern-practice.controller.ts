import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatternPracticeService } from '../services/pattern-practice.service';
import { CreatePatternPracticeDto } from '../dto/create-pattern-practice.dto';
import { UpdatePatternPracticeDto } from '../dto/update-pattern-practice.dto';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';
import { Maintainer } from 'src/common/metadata/maintainer.metadata';

@Controller('pattern-practice')
export class PatternPracticeController {
  constructor(private readonly patternPracticeService: PatternPracticeService) {}

  @Maintainer()
  @Post()
  async create(@Body() createPatternPracticeDto: CreatePatternPracticeDto) {
    return await this.patternPracticeService.create(createPatternPracticeDto);
  }

  @SkipAuth()
  @Get()
  findAll() {
    return this.patternPracticeService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patternPracticeService.findOne(+id);
  }

  @Maintainer()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePatternPracticeDto: UpdatePatternPracticeDto) {
    return this.patternPracticeService.update(+id, updatePatternPracticeDto);
  }

  @Maintainer()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patternPracticeService.remove(+id);
  }
}

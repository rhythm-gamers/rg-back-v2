import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LevelTestService } from '../services/level-test.service';
import { CreateLevelTestDto } from '../dto/create-level-test.dto';
import { UpdateLevelTestDto } from '../dto/update-level-test.dto';
import { Maintainer } from 'src/common/metadata/maintainer.metadata';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';

@Controller('level-test')
export class LevelTestController {
  constructor(private readonly levelTestService: LevelTestService) {}

  @Maintainer()
  @Post()
  async create(@Body() createLevelTestDto: CreateLevelTestDto) {
    return await this.levelTestService.create(createLevelTestDto);
  }

  @SkipAuth()
  @Get()
  async findAll() {
    return await this.levelTestService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.levelTestService.findOne(+id);
  }

  @Maintainer()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLevelTestDto: UpdateLevelTestDto) {
    return await this.levelTestService.update(+id, updateLevelTestDto);
  }

  @Maintainer()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.levelTestService.remove(+id);
  }
}

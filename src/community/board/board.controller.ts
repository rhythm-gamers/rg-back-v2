import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BoardService } from './board.service';
import { Maintainer } from 'src/common/metadata/maintainer.metadata';
import { UpsertBoardDto } from './dto/upsert-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Maintainer()
  @Post()
  async create(@Body() dto: CreateBoardDto) {
    return await this.boardService.upsert(dto);
  }

  @Maintainer()
  @Put(':title')
  async update(@Param('title') title: string, @Body() dto: UpdateBoardDto) {
    return await this.boardService.upsert(dto, title);
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':title')
  async findOne(@Param('title') title: string) {
    return await this.boardService.findOne(title);
  }

  @Maintainer()
  @Delete(':title')
  async remove(@Param('title') title: string) {
    return await this.boardService.remove(title);
  }
}

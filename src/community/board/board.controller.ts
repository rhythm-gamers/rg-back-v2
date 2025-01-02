import { Controller, Get, Post, Body, Param, Delete, Res, Query, HttpStatus, Patch } from '@nestjs/common';
import { BoardService } from './board.service';
import { Maintainer } from 'src/common/metadata/maintainer.metadata';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Response } from 'express';
import { InfoBoardDto } from './dto/info-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Maintainer()
  @Post()
  async create(@Res() res: Response, @Body() dto: CreateBoardDto) {
    await this.boardService.create(dto);
    res.status(HttpStatus.CREATED).send();
  }

  @Maintainer()
  @Patch(':title')
  async update(@Res() res: Response, @Param('title') title: string, @Body() dto: UpdateBoardDto) {
    await this.boardService.update(title, dto);
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  async pagenatedBoards(@Res() res: Response, @Query('page') page: string, @Query('take') take: string) {
    const results = await this.boardService.fetchPagenatedBoards(+page, +take);
    const dto = results.forEach(result => new InfoBoardDto(result.title, result.description));
    res.status(HttpStatus.OK).send(dto);
  }

  @Get(':title')
  async findOne(@Res() res: Response, @Param('title') title: string) {
    const result = await this.boardService.findOne(title);
    res.status(HttpStatus.OK).send(result);
  }

  @Maintainer()
  @Delete(':title')
  async remove(@Res() res: Response, @Param('title') title: string) {
    await this.boardService.remove(title);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}

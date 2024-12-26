import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';
import { Maintainer } from 'src/common/metadata/maintainer.metadata';
import { Response } from 'express';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Maintainer()
  @Post()
  async create(@Res() res: Response, @Body() createWikiDto: CreateWikiDto) {
    await this.wikiService.create(createWikiDto);
    res.send();
  }

  @SkipAuth()
  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.wikiService.findAll();
    res.send(result);
  }

  @SkipAuth()
  @Get('search')
  async search(@Res() res: Response, @Query('term') term: string) {
    const result = await this.wikiService.search(term);
    res.send(result);
  }

  @SkipAuth()
  @Get(':title')
  async findOne(@Res() res: Response, @Param('title') title: string) {
    const result = await this.wikiService.findOne(title);
    res.send(result);
  }

  @Maintainer()
  @Patch(':originTitle')
  async update(@Res() res: Response, @Param('originTitle') originTitle: string, @Body() updateWikiDto: UpdateWikiDto) {
    await this.wikiService.update(originTitle, updateWikiDto);
    res.send();
  }

  @Maintainer()
  @Delete(':title')
  async remove(@Res() res: Response, @Param('title') title: string) {
    await this.wikiService.remove(title);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}

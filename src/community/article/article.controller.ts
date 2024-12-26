import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Query, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Response } from 'express';
import { User } from 'src/user/entity/user.entity';
import { Article } from './entities/article.entity';
import { ArticleDetailDto } from './dto/article-detail.dto';
import { SimpleArticleDetailDto } from './dto/simple-article-detail.dto';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';
import { ToggleResult } from 'src/common/enum/toggle-result.enum';
import { getUserFromRequest } from 'src/common/utils/user-request-handler';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Req() req, @Res() res: Response, @Body() createArticleDto: CreateArticleDto) {
    const user: User = getUserFromRequest(req);
    const result: Article = await this.articleService.create(user, createArticleDto);
    res.send(result);
  }

  @SkipAuth()
  @Get('notice')
  async getNoticeArticles(@Res() res: Response, @Query('boardname') boardname: string) {
    const response: SimpleArticleDetailDto[] = await this.articleService.getNoticeArticles(boardname);
    res.status(HttpStatus.OK).send(response);
  }

  @SkipAuth()
  @Get(':id')
  async getArticle(@Res() res: Response, @Param('id') id: string) {
    const response: ArticleDetailDto = await this.articleService.getArticle(+id);
    res.status(HttpStatus.OK).send(response);
  }

  @SkipAuth()
  @Get()
  async getPagenatedArticles(
    @Res() res: Response,
    @Query('boardname') boardname: string,
    @Query('page') page: string,
    @Query('take') take: string,
  ) {
    const response: SimpleArticleDetailDto[] = await this.articleService.getPagenatedArticles(boardname, +page, +take);
    res.status(HttpStatus.OK).send(response);
  }

  @Patch(':id')
  async update(@Req() req, @Res() res: Response, @Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    const user: User = getUserFromRequest(req);
    await this.articleService.update(user, +id, updateArticleDto);
    res.send();
  }

  @Delete(':id')
  async remove(@Req() req, @Res() res: Response, @Param('id') id: string) {
    const user: User = getUserFromRequest(req);
    await this.articleService.remove(user, +id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put(':id')
  async toggleArticleLike(@Req() req, @Res() res: Response, @Param('id') id: string) {
    const user: User = getUserFromRequest(req);
    const result: ToggleResult = await this.articleService.toggleLike(user, +id);
    const httpStatus = result === ToggleResult.TOGGLE_APPEND ? HttpStatus.OK : HttpStatus.NO_CONTENT;
    res.status(httpStatus).send();
  }
}

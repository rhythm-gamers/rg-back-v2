import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Put, Res, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/user/entity/user.entity';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';
import { ToggleResult } from 'src/common/enum/toggle-result.enum';
import { Response } from 'express';
import { getUserFromRequest } from 'src/common/utils/user-request-handler';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Req() req, @Body() createCommentDto: CreateCommentDto) {
    const user: User = getUserFromRequest(req);
    return await this.commentService.create(user, createCommentDto);
  }

  @SkipAuth()
  @Get()
  async getPagenatedComment(
    @Query('articleId') articleId: string,
    @Query('page') page: string,
    @Query('take') take: string,
  ) {
    return await this.commentService.pagenatedComments(+articleId, +page, +take);
  }

  @Get('mine')
  async getMyComments(@Req() req, @Query('page') page: string, @Query('take') take: string) {
    const user: User = getUserFromRequest(req);
    return await this.commentService.fetchMyComments(user, +page, +take);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    const user: User = getUserFromRequest(req);
    return await this.commentService.update(+id, user, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const user: User = getUserFromRequest(req);
    await this.commentService.remove(user, +id);
  }

  @Put(':id')
  async toggleCommentLike(@Req() req, @Res() res: Response, @Param('id') id: string) {
    const user: User = getUserFromRequest(req);
    const result: ToggleResult = await this.commentService.toggleLike(user, +id);
    const httpStatus = result === ToggleResult.TOGGLE_APPEND ? HttpStatus.OK : HttpStatus.NO_CONTENT;
    res.status(httpStatus).send();
  }
}

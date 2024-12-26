import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { Article } from '../article/entities/article.entity';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/common/enum/user-role.enum';
import { PagenatedCommentsDto } from './dto/pagenated-comment.dto';
import { ToggleResult } from 'src/common/enum/toggle-result.enum';
import { CommentLike } from './entities/comment-like.entity';
import { CommentDetailDto } from './dto/comment-detail.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    private readonly articleService: ArticleService,
  ) {}

  async create(user: User, createCommentDto: CreateCommentDto) {
    const articleId: number = +createCommentDto.articleId;
    delete createCommentDto.articleId;
    const parentId: number = +createCommentDto.parentId;
    delete createCommentDto.parentId;

    return parentId
      ? await this.createSubComment(user, articleId, createCommentDto.content, parentId)
      : await this.createComment(user, articleId, createCommentDto.content);
  }

  async createComment(user: User, articleId: number, content: string) {
    const article: Article = await this.articleService.findOne(articleId);
    const comment: Comment = new Comment();

    const sequence: number = 1;

    return await this.commentRepository.manager.transaction(async manager => {
      const groupId = ((await manager.maximum(Comment, 'groupId', { article: { id: articleId } })) ?? 0) + 1;

      await manager.save(article);

      Object.assign(comment, {
        content,
        groupId,
        sequence,
        childCount: 0,
        article: article,
        user: user,
      } as Comment);
      return await manager.save(comment);
    });
  }

  async createSubComment(user: User, articleId: number, content: string, parentId: number) {
    const article: Article = await this.articleService.findOne(articleId);
    const comment: Comment = new Comment();

    return await this.commentRepository.manager.transaction(async manager => {
      const parent: Comment = await manager.findOneByOrFail(Comment, { id: parentId });
      const groupId: number = parent.groupId;
      const sequence: number = parent.sequence + parent.childCount + 1;
      const depth: number = (parent.depth ?? 0) + 1;

      if (parent.isDeleted) throw new BadRequestException('삭제된 댓글입니다');

      await manager
        .createQueryBuilder()
        .update(Comment)
        .set({ sequence: () => 'sequence + 1' })
        .where('groupId = :groupId', { groupId })
        .andWhere('sequence >= :sequence', { sequence: sequence })
        .execute();

      await manager.update(Comment, { id: parent.id }, { childCount: () => 'childCount + 1' });

      await manager.save(article);

      Object.assign(comment, {
        content,
        groupId,
        sequence,
        parentId,
        depth,
        childCount: 0,
        article: article,
        user: user,
      } as Comment);
      return await manager.save(comment);
    });
  }

  async pagenatedComments(articleId: number, page: number, take: number) {
    const comments: object[] = await this.commentRepository
      .createQueryBuilder('c')
      .leftJoin('c.likes', 'cl')
      .leftJoin('c.user', 'u')
      .select([
        'c.id as id',
        'c.content as content',
        'c.depth as depth',
        'c.createdAt as createdAt',
        'c.updatedAt as updatedAt',
        'u.nickname as nickname',
        'u.profileImage as profileImage',
        'COUNT(DISTINCT cl.id) as likeCount',
      ])
      .where('c.articleId = :articleId', { articleId })
      .groupBy('c.id')
      .orderBy('c.groupId', 'ASC')
      .addOrderBy('c.sequence', 'ASC')
      .skip((page - 1) * take)
      .take(take)
      .getRawMany();

    return comments.map(comment => new CommentDetailDto(comment));
  }

  makePagenatedResponseDto(comments: Comment[]) {
    return comments.map(comment => new PagenatedCommentsDto(comment));
  }

  async fetchMyComments(user: User, page: number, take: number) {
    const comments: Comment[] = await this.commentRepository.find({
      where: {
        user: user,
        isDeleted: false,
      },
      relations: ['user'],
      skip: (page - 1) * take,
      take: take,
      order: { createdAt: 'DESC' },
    });

    return this.makePagenatedResponseDto(comments);
  }

  async findOne(id: number) {
    const comment: Comment = await this.commentRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['user'],
    });
    return comment;
  }

  async update(id: number, user: User, updateCommentDto: UpdateCommentDto) {
    const comment: Comment = await this.findOne(id);
    if (JSON.stringify(comment.user) !== JSON.stringify(user)) throw new BadRequestException('소유자가 아닙니다');

    Object.assign(comment, {
      ...updateCommentDto,
      updatedAt: new Date(),
    } as Comment);
    return await this.commentRepository.save(comment);
  }

  async remove(user: User, id: number) {
    const comment: Comment = await this.commentRepository.findOneOrFail({
      where: { id },
      relations: ['article', 'user'],
    });

    if (JSON.stringify(comment.user) !== JSON.stringify(user) && user.role !== UserRole.ADMIN)
      throw new BadRequestException('소유자가 아닙니다');

    if (comment.isDeleted) throw new BadRequestException('이미 삭제된 댓글입니다');

    await this.commentRepository.manager.transaction(async manager => {
      const counts: number = await manager.countBy(Comment, { parentId: comment.id });
      if (counts === 0) {
        await manager.remove(comment);
      } else {
        comment.isDeleted = true;
        comment.content = '삭제된 댓글입니다';
        comment.user = null;
        await manager.save(comment);
      }
    });
  }

  async toggleLike(user: User, commentId: number): Promise<ToggleResult> {
    const comment: Comment = await this.commentRepository.findOneOrFail({
      where: {
        id: commentId,
      },
    });

    const existingLike = await this.commentLikeRepository.findOne({
      where: {
        user: { id: user.id },
        comment: { id: commentId },
      },
    });

    if (existingLike) {
      await this.commentRepository.manager.transaction(async manager => {
        await manager.remove(CommentLike, existingLike);
        await manager.save(Comment, comment);
      });
      return ToggleResult.TOGGLE_DELETE;
    } else {
      const commentLike: CommentLike = new CommentLike();
      commentLike.user = user;
      commentLike.comment = comment;

      await this.commentRepository.manager.transaction(async manager => {
        await manager.save(CommentLike, commentLike);
      });
      return ToggleResult.TOGGLE_APPEND;
    }
  }
}

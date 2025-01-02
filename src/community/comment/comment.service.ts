import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { EntityManager, Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { Article } from '../article/entities/article.entity';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/common/enum/user-role.enum';
import { PagenatedCommentsDto } from './dto/pagenated-comment.dto';
import { ToggleResult } from 'src/common/enum/toggle-result.enum';
import { CommentLike } from './entities/comment-like.entity';
import { CommentDetailDto } from './dto/comment-detail.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CommentMessageQueueDto } from './dto/comment-message-queue.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly articleService: ArticleService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async create(user: User, createCommentDto: CreateCommentDto) {
    const { articleId, parentId, content } = createCommentDto;

    const commentMessageQueueDto = parentId
      ? await this.createSubComment(user, articleId, content, parentId)
      : await this.createComment(user, articleId, content);

    this.rabbitClient.emit('notification', { data: commentMessageQueueDto });
  }

  private async createComment(user: User, articleId: number, content: string): Promise<CommentMessageQueueDto> {
    const article: Article = await this.articleService.findOne(articleId);

    try {
      return await this.commentRepository.manager.transaction(async manager => {
        const maxGroupId = await manager.maximum(Comment, 'groupId', { article: { id: articleId } });
        const groupId = (maxGroupId ?? 0) + 1;

        const comment: Comment = manager.create(Comment, {
          content,
          groupId,
          sequence: 1,
          article,
          user,
        });
        await manager.save(comment);

        let titleSubStr = article.title.substring(0, 10);
        if (titleSubStr.length !== article.title.length) titleSubStr += '...';

        let commentSubStr = content.substring(0, 20);
        if (commentSubStr.length !== content.length) commentSubStr += '...';

        return {
          article: {
            id: article.id,
            targetUUID: article.user.id,
            title: titleSubStr,
            comment: commentSubStr,
          },
        } as CommentMessageQueueDto;
      });
      // message queue를 이용하여 sse 서버로 전달
    } catch (err) {
      console.log(err);
    }
  }

  private async getMaxSequenceByRec(manager: EntityManager, parentId: number): Promise<number> {
    const result = await manager.findOne(Comment, {
      where: { parentId },
      order: { id: 'DESC' },
    });

    if (!result) return 0;

    const childMaxSequence = await this.getMaxSequenceByRec(manager, result.id);
    return Math.max(result.sequence, childMaxSequence);
  }

  private async getMaxSequenceByCTE(manager: EntityManager, parentId: number): Promise<number> {
    const result = await manager.query(
      `
      WITH RECURSIVE comments_tree AS (
          SELECT id, sequence, parentId 
          FROM comment
          WHERE parentId = $1
          
          UNION ALL
          
          SELECT c.id, c.sequence, c.parentId
          FROM comment c
          JOIN comments_tree ct ON c.parentId = ct.id
      )
      SELECT MAX(sequence) as max_sequence 
      FROM comments_tree
  `,
      [parentId],
    );
    return result[0]?.max_sequence || 0;
  }

  private async createSubComment(
    user: User,
    articleId: number,
    content: string,
    parentId: number,
  ): Promise<CommentMessageQueueDto> {
    const article: Article = await this.articleService.findOne(articleId);

    const parent: Comment = await this.commentRepository.findOne({
      where: { id: parentId },
      relations: ['user'],
    });
    if (!parent) throw new BadRequestException('삭제된 댓글입니다');

    const groupId: number = parent.groupId;
    const depth: number = parent.depth + 1;

    try {
      return await this.commentRepository.manager.transaction(async manager => {
        const maxSequence = await this.getMaxSequenceByRec(manager, parentId);
        // const maxSequence = await this.getMaxSequenceByCTE(manager, parentId);
        const sequence = Math.max(maxSequence, parent.sequence) + 1;

        await manager
          .createQueryBuilder()
          .update(Comment)
          .set({ sequence: () => 'sequence + 1' })
          .where('groupId = :groupId', { groupId })
          .andWhere('sequence >= :sequence', { sequence: sequence })
          .execute();

        const comment: Comment = manager.create(Comment, {
          content,
          groupId,
          sequence,
          parentId,
          depth,
          article,
          user,
          target: parent.user,
        });
        await manager.save(comment);

        let titleSubStr = article.title.substring(0, 10);
        if (titleSubStr.length !== article.title.length) titleSubStr += '...';
        let commentSubStr = content.substring(0, 20);
        if (commentSubStr.length !== content.length) commentSubStr += '...';

        const commonData = { title: titleSubStr, comment: commentSubStr };
        return {
          ...(parent.user.id !== article.user.id && {
            article: { id: article.id, targetUUID: article.user.id, ...commonData },
          }),
          comment: { id: parent.id, targetUUID: parent.user.id, ...commonData },
        } as CommentMessageQueueDto;
      });
      // messaging queue를 이용하여 sse 서버로 전달
    } catch (err) {
      console.log(err);
    }
  }

  async pagenatedComments(articleId: number, page: number, take: number) {
    const comments: object[] = await this.commentRepository
      .createQueryBuilder('c')
      .withDeleted() // deletedAt이 있는 field도 검색하겠다
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
      .addOrderBy('c.createdAt', 'ASC')
      // .addOrderBy('c.sequence', 'ASC') // N depth 댓글 구조일 경우 위의 조건을 주석 처리하고 이거로 바꿔주세요!
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
      where: { user },
      relations: ['user'],
      skip: (page - 1) * take,
      take: take,
      order: { createdAt: 'DESC' },
    });

    return this.makePagenatedResponseDto(comments);
  }

  async update(commentId: number, user: User, updateCommentDto: UpdateCommentDto) {
    const comment: Comment = await await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) throw new BadRequestException('이미 삭제된 댓글입니다');
    if (comment.user.id !== user.id) throw new BadRequestException('소유자가 아닙니다');

    Object.assign(comment, {
      ...updateCommentDto,
      updatedAt: new Date(),
    } as Comment);
    await this.commentRepository.save(comment);
  }

  async remove(user: User, commentId: number) {
    const comment: Comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['article', 'user'],
    });

    if (!comment) throw new BadRequestException('이미 삭제된 댓글입니다');
    if (comment.user.id !== user.id && user.role !== UserRole.ADMIN) throw new BadRequestException('소유자가 아닙니다');

    await this.commentRepository.manager.transaction(async manager => {
      await manager.softRemove(comment);
    });
  }

  async toggleLike(user: User, commentId: number): Promise<ToggleResult> {
    const comment: Comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) throw new BadRequestException('이미 삭제된 댓글입니다');

    return await this.commentRepository.manager.transaction(async manager => {
      const existingLike = await manager.findOneBy(CommentLike, {
        user: { id: user.id },
        comment: { id: commentId },
      });

      if (existingLike) {
        await manager.remove(existingLike);
        return ToggleResult.TOGGLE_DELETE;
      } else {
        const commentLike: CommentLike = manager.create(CommentLike, {
          user,
          comment,
        });
        await manager.save(commentLike);
        return ToggleResult.TOGGLE_APPEND;
      }
    });
  }
}

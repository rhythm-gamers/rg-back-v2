import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { BoardService } from '../board/board.service';
import { Board } from '../board/entities/board.entity';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/common/enum/user-role.enum';
import { SimpleArticleDetailDto } from './dto/simple-article-detail.dto';
import { ArticleDetailDto } from './dto/article-detail.dto';
import { ArticleLike } from './entities/article-like.entity';
import { ToggleResult } from 'src/common/enum/toggle-result.enum';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    private readonly boardService: BoardService,
  ) {}

  async create(user: User, createArticleDto: CreateArticleDto) {
    if (user.role !== UserRole.ADMIN && createArticleDto.isNotice === true)
      throw new UnauthorizedException('공지는 ADMIN만 등록 가능합니다');

    const boardname = createArticleDto.boardname;
    delete createArticleDto.boardname;
    const board: Board = await this.boardService.findOne(boardname);
    const article: Article = new Article();
    Object.assign(article, {
      ...createArticleDto,
      board: board,
      user: user,
    });

    return await this.articleRepository.save(article);
  }

  async getNoticeArticles(boardname: string) {
    const articles: Article[] = await this.articleRepository.find({
      where: {
        board: {
          title: boardname,
        },
        isNotice: true,
      },
      relations: ['user'],
      take: 10,
      order: { id: 'DESC' },
    });

    return articles.map(article => new SimpleArticleDetailDto(article));
  }

  async getPagenatedArticles(boardname: string, page: number, take: number): Promise<SimpleArticleDetailDto[]> {
    const articles: Article[] = await this.articleRepository.find({
      where: {
        board: { title: boardname },
      },
      relations: ['user'],
      skip: (page - 1) * take,
      take,
      order: { id: 'DESC' },
    });

    return articles.map(article => new SimpleArticleDetailDto(article));
  }

  async getArticle(id: number): Promise<ArticleDetailDto> {
    const article: Article = await this.articleRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });
    return new ArticleDetailDto(article);
  }

  async findOne(id: number): Promise<Article> {
    return await this.articleRepository.findOneOrFail({
      where: { id },
    });
  }

  async update(user: User, id: number, updateArticleDto: UpdateArticleDto) {
    const article: Article = await this.articleRepository.findOneOrFail({
      where: {
        id,
        user,
      },
      relations: ['user'],
    });

    if (article.user.id !== user.id) throw new BadRequestException('작성자가 아닙니다');

    Object.assign(article, updateArticleDto);
    article.updatedAt = new Date();

    await this.articleRepository.manager.transaction(async manager => {
      await manager.save(article);
    });
  }

  async remove(user: User, id: number) {
    const article: Article = await this.articleRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (article.user.id !== user.id && user.role !== UserRole.ADMIN) throw new BadRequestException('작성자가 아닙니다');

    await this.articleRepository.manager.transaction(async manager => {
      await manager.remove(article);
    });
  }

  async toggleLike(user: User, articleId: number): Promise<ToggleResult> {
    const article = await this.articleRepository.findOneOrFail({
      where: {
        id: articleId,
      },
    });

    const existingLike = await this.articleLikeRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        article: {
          id: articleId,
        },
      },
      relations: ['user', 'article'],
    });

    console.log(existingLike);

    if (existingLike) {
      await this.articleRepository.manager.transaction(async manager => {
        article.likeCount -= 1;
        await manager.remove(ArticleLike, existingLike);
        await manager.save(Article, article);
      });
      return ToggleResult.TOGGLE_DELETE;
    } else {
      article.likeCount += 1;

      const articleLike: ArticleLike = new ArticleLike();
      articleLike.user = user;
      articleLike.article = article;

      await this.articleRepository.manager.transaction(async manager => {
        await manager.save(ArticleLike, articleLike);
        await manager.save(Article, article);
      });
      return ToggleResult.TOGGLE_APPEND;
    }
  }
}

import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from '../board/board.module';
import { ArticleLike } from './entities/article-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleLike]), BoardModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}

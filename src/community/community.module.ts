import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [BoardModule, ArticleModule, CommentModule],
})
export class CommunityModule {}

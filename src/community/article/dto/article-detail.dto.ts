import { Article } from '../entities/article.entity';
import { UserSimpleInfoDto } from 'src/user/dto/user-simple-info.dto';

export class ArticleDetailDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  commentCount: number;
  likeCount: number;
  user: UserSimpleInfoDto;

  constructor(article: Article) {
    this.id = article.id;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.title = article.title;
    this.content = article.content;
    this.user = new UserSimpleInfoDto(article.user);
    this.commentCount = article.commentCount;
    this.likeCount = article.likeCount;
  }
}

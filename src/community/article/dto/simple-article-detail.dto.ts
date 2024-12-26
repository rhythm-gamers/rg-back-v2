import { UserSimpleInfoDto } from 'src/user/dto/user-simple-info.dto';
import { Article } from '../entities/article.entity';

export class SimpleArticleDetailDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserSimpleInfoDto;

  constructor(article: Article) {
    this.id = article.id;
    this.title = article.title;
    this.content = article?.content.substring(0, 100) ?? '';
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.user = new UserSimpleInfoDto(article.user);
  }
}

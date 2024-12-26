import { ArticleDetailDto } from './article-detail.dto';

export class SimpleArticleDetailDto extends ArticleDetailDto {
  id: number;
  title: string;
  content: string;
  isNotice: boolean;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  likeCount: number;
  nickname: string;
  profileImage: string;

  constructor(queryResult) {
    super(queryResult);
    if (!queryResult) return;
    const maxPreviewLength = 50;
    this.content = this.content
      ? this.content.length > maxPreviewLength
        ? this.content.substring(0, maxPreviewLength) + '...'
        : this.content
      : '';
  }
}

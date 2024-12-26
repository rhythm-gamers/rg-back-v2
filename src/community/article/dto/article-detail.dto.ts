export class ArticleDetailDto {
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
    if (!queryResult) {
      this.id = null;
      return;
    }
    this.id = Number(queryResult.id);
    this.title = queryResult.title;
    this.content = queryResult.content;
    this.isNotice = queryResult.isNotice === 'true';
    this.createdAt = new Date(queryResult?.createdAt);
    this.updatedAt = queryResult.updatedAt ? new Date(queryResult.updatedAt) : null;
    this.commentCount = Number(queryResult.commentCount);
    this.likeCount = Number(queryResult.likeCount);
    this.nickname = queryResult.nickname;
    this.profileImage = queryResult.profileImage;
  }
}

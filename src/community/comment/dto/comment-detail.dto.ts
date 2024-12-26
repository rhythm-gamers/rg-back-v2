export class CommentDetailDto {
  id: number;
  content: number;
  depth: number;
  createdAt: Date;
  updatedAt: Date;
  nickname: string;
  profileImage: string;
  likeCount: number;

  constructor(queryResult) {
    if (!queryResult) {
      this.id = null;
      return;
    }
    this.id = Number(queryResult.id);
    this.content = queryResult.content;
    this.depth = Number(queryResult.depth);
    this.createdAt = new Date(queryResult?.createdAt);
    this.updatedAt = queryResult.updatedAt ? new Date(queryResult.updatedAt) : null;
    this.nickname = queryResult.nickname;
    this.profileImage = queryResult.profileImage;
    this.likeCount = Number(queryResult.likeCount);
  }
}

import { Comment } from '../entities/comment.entity';

export class PagenatedCommentsDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likes: number;
  depth: number;
  deleted: boolean;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.content = comment.content;
    this.likes = comment.likeCount;
    this.depth = comment.depth;
    this.deleted = comment.isDeleted;
  }
}

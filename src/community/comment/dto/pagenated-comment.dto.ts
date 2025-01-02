import { UserSimpleInfoDto } from 'src/user/dto/user-simple-info.dto';
import { Comment } from '../entities/comment.entity';

export class PagenatedCommentsDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likes: number;
  depth: number;
  deleted: boolean;
  user: UserSimpleInfoDto;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.content = comment.content;
    this.depth = comment.depth;
    this.deleted = comment.deletedAt ? true : false;
    this.user = new UserSimpleInfoDto(comment.user?.nickname ?? null, comment.user?.profileImage ?? null);
  }
}

import { User } from 'src/user/entity/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, comment => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  comment: Comment;

  @ManyToOne(() => User, user => user.commentLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}

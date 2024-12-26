import { User } from 'src/user/entity/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class ArticleLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, article => article.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  article: Article;

  @ManyToOne(() => User, user => user.commentLikes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}

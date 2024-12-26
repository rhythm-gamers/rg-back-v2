import { CommunityBaseEntity } from 'src/common/entity/community-base.entity';
import { Board } from 'src/community/board/entities/board.entity';
import { Comment } from 'src/community/comment/entities/comment.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ArticleLike } from './article-like.entity';

@Entity()
export class Article extends CommunityBaseEntity {
  @Column({ length: 50 })
  title: string;

  @Column('text', { default: '' })
  content: string;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  isNotice: boolean;

  @ManyToOne(() => Board, board => board.articles, { onDelete: 'CASCADE' })
  @JoinColumn()
  board: Board;

  @OneToMany(() => Comment, comment => comment.article, { cascade: ['remove'] })
  comments: Comment[];

  @ManyToOne(() => User, user => user.articles, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => ArticleLike, like => like.article, { cascade: ['remove'] })
  likes: ArticleLike[];
}

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

  @Column({ default: false })
  isNotice: boolean;

  @ManyToOne(() => Board, board => board.articles, { onUpdate: 'CASCADE' })
  @JoinColumn()
  board: Board;

  @OneToMany(() => Comment, comment => comment.article, { cascade: ['soft-remove'] })
  comments: Comment[];

  @ManyToOne(() => User, user => user.articles, { onDelete: 'NO ACTION' })
  @JoinColumn()
  user: User;

  @OneToMany(() => ArticleLike, like => like.article, { cascade: ['soft-remove'] })
  likes: ArticleLike[];
}

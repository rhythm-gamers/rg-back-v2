import { CommunityBaseEntity } from 'src/common/entity/community-base.entity';
import { Article } from 'src/community/article/entities/article.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CommentLike } from './comment-like.entity';

@Entity()
@Index('IDX_PARENT_SEQUENCE', ['parentId', 'sequence'])
export class Comment extends CommunityBaseEntity {
  @Column({ length: 1000 })
  content: string;

  @Column({ default: -1 })
  parentId: number;

  @Index()
  @Column({ default: 1 })
  groupId: number;

  @Column({ default: 0 })
  depth: number;

  @Column({ default: 1 })
  sequence: number;

  @OneToOne(() => User)
  replyTo: User;

  @ManyToOne(() => Article, article => article.comments, { onDelete: 'NO ACTION' })
  @JoinColumn()
  article: Article;

  @ManyToOne(() => User, user => user.comments, { onDelete: 'NO ACTION' })
  @JoinColumn()
  user: User;

  @OneToMany(() => CommentLike, like => like.comment, { cascade: ['soft-remove'] })
  likes: CommentLike[];
}

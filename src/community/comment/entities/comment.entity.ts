import { CommunityBaseEntity } from 'src/common/entity/community-base.entity';
import { Article } from 'src/community/article/entities/article.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentLike } from './comment-like.entity';

@Entity()
export class Comment extends CommunityBaseEntity {
  @Column({ length: 1000 })
  content: string;

  @Index()
  @Column({ default: -1 })
  parentId: number;

  @Index()
  @Column({ default: 1 })
  groupId: number;

  @Column({ default: 0 })
  depth: number;

  @Column({ default: 1 })
  sequence: number;

  @Column({ default: 0 })
  childCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Article, article => article.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  article: Article;

  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => CommentLike, like => like.comment, { cascade: ['remove'] })
  likes: CommentLike[];
}

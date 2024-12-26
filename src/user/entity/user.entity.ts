import { CommonEntity } from 'src/common/entity/common.entity';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ArticleLike } from 'src/community/article/entities/article-like.entity';
import { Article } from 'src/community/article/entities/article.entity';
import { CommentLike } from 'src/community/comment/entities/comment-like.entity';
import { Comment } from 'src/community/comment/entities/comment.entity';
import { PlateData } from 'src/plate-data/entities/plate-data.entity';
import { LevelTestProgress } from 'src/progress/entities/level-test-progress.entity';
import { PatternPracticeProgress } from 'src/progress/entities/pattern-practice-progress.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @Column({ length: 20, unique: true, nullable: true })
  username: string | null;

  @Column({ length: 20, unique: true, nullable: true })
  nickname: string | null;

  @Column({ nullable: true })
  password: string | null;

  @Column({ nullable: true })
  profileImage: string | null;

  @Column({ nullable: true, default: '', length: 200 })
  introduce: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToOne(() => PlateData, data => data.user, { cascade: true })
  plateData: PlateData;

  @OneToMany(() => LevelTestProgress, progress => progress.user, { cascade: true })
  levelTestProgresses: LevelTestProgress[];

  @OneToMany(() => PatternPracticeProgress, progress => progress.user, { cascade: true })
  patternPracticeProgresses: PatternPracticeProgress[];

  @OneToMany(() => Article, article => article.user, { cascade: ['remove', 'soft-remove'] })
  articles: Article[];

  @OneToMany(() => ArticleLike, like => like.user, { cascade: ['remove', 'soft-remove'] })
  articleLikes: ArticleLike[];

  @OneToMany(() => Comment, comment => comment.user, { cascade: ['remove', 'soft-remove'] })
  comments: Comment[];

  @OneToMany(() => CommentLike, like => like.user, { cascade: ['remove', 'soft-remove'] })
  commentLikes: CommentLike[];

  constructor(username: string, password: string, nickname: string, profileImage?: string) {
    super();
    this.username = username;
    this.password = password;
    this.nickname = nickname;
    this.profileImage = profileImage ?? `user/profile/image/default`;
    this.plateData = new PlateData();
  }
}

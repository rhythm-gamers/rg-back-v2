import { CommunityBaseEntity } from 'src/common/entity/community-base.entity';
import { Article } from 'src/community/article/entities/article.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Board extends CommunityBaseEntity {
  @Column({ length: 20, unique: true })
  title: string;

  @Column({ length: 100 })
  description: string;

  @OneToMany(() => Article, article => article.board, { cascade: ['soft-remove'] })
  articles: Article[];
}

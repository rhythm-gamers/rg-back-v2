import { Column, Entity, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class BackupUser {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ length: 20 })
  username: string;

  @Column({ length: 20 })
  nickname: string;

  @Column()
  deletedAt: Date;

  constructor(user: User) {
    this.id = user?.id ?? null;
    this.username = user?.username ?? null;
    this.nickname = user?.nickname ?? null;
    this.deletedAt = user?.deletedAt ?? null;
  }
}

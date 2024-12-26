import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlateData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  backgroundDesign: number;

  @Column({ default: 0 })
  title: number;

  @Column({ default: 0 })
  rank: number;

  // 보여주기 여부
  @Column({ default: true })
  isShowComment: boolean;

  @Column({ default: true })
  isShowLevel: boolean;

  @Column({ default: true })
  isShowTitle: boolean;

  @Column({ default: true })
  isShowTitleIcon: boolean;

  @OneToOne(() => User, user => user.plateData, { cascade: ['insert'] })
  @JoinColumn()
  user: User;
}

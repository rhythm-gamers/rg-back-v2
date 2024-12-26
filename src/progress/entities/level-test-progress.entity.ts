import { LevelTest } from 'src/assessment/entities/level-test.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LevelTestProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LevelTest, levelTest => levelTest.levelTestProgresses, { onDelete: 'CASCADE' })
  @JoinColumn()
  levelTest: LevelTest;

  @ManyToOne(() => User, user => user.levelTestProgresses, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column('decimal', { precision: 5, scale: 2 })
  rate: number;
}

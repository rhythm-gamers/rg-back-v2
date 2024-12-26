import { PatternInfo } from 'src/pattern-info/entities/pattern-info.entity';
import { LevelTestProgress } from 'src/progress/entities/level-test-progress.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LevelTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ type: 'tinyint', default: 1 })
  level: number;

  @Column('decimal', { precision: 5, scale: 2 })
  goalRate: number;

  @Column({ default: 4 })
  keyNum: number;

  @Column({ default: '' })
  jacketSrc: string;

  @Column({ default: '' })
  noteSrc: string;

  @OneToOne(() => PatternInfo, { cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  patternInfo: PatternInfo;

  @OneToMany(() => LevelTestProgress, progress => progress.levelTest, { cascade: true })
  levelTestProgresses: LevelTestProgress[];
}

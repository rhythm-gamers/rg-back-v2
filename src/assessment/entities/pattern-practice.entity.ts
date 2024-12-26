import { PatternInfo } from 'src/pattern-info/entities/pattern-info.entity';
import { PatternPracticeProgress } from 'src/progress/entities/pattern-practice-progress.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PatternPractice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ default: 0 })
  keyNum: number;

  @Column({ default: '' })
  jacketSrc: string;

  @Column({ default: '' })
  noteSrc: string;

  @OneToOne(() => PatternInfo, { cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  patternInfo: PatternInfo;

  @OneToMany(() => PatternPracticeProgress, progress => progress.patternPractice, {
    cascade: true,
  })
  patternPracticeProgresses: PatternPracticeProgress[];
}

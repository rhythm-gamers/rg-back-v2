import { PatternPractice } from 'src/assessment/entities/pattern-practice.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PatternPracticeProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PatternPractice, patternPractice => patternPractice.patternPracticeProgresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patternPractice: PatternPractice;

  @ManyToOne(() => User, user => user.patternPracticeProgresses, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column('decimal', { precision: 5, scale: 2 })
  rate: number;
}

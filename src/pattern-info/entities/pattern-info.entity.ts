import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PatternInfo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, default: 0 })
  roll: number;

  @Column({ nullable: true, default: 0 })
  offGrid: number;

  @Column({ nullable: true, default: 0 })
  stairs: number;

  @Column({ nullable: true, default: 0 })
  peak: number;

  @Column({ nullable: true, default: 0 })
  trill: number;

  @Column({ nullable: true, default: 0 })
  hold: number;
}

import { BaseEntity, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}

import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class CommunityBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}

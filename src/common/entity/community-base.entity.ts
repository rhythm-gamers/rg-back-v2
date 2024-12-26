import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class CommunityBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}

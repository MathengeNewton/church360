import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column('jsonb')
  data: any;

  @Column()
  date: Date;
}

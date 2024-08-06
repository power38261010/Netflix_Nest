import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pay } from './pay.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class PaySubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isAnual: boolean;

  @Column()
  payerEmail: string;

  @Column()
  token: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  paidDate: Date;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @ManyToOne(() => Pay, (pay) => pay.paySubscriptions)
  @JoinColumn({ name: 'payId' })
  pay: Pay;

  @ManyToOne(() => User, (user) => user.paySubscriptions)
  @JoinColumn({ name: 'userId' })
  user: User;
}

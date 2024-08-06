import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { PaySubscription } from './pay-subscription.entity';

@Entity()
export class Pay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column('decimal', { precision: 18, scale: 2 })
  monthlyPayment: number;

  @ManyToOne(() => Subscription, (subscription) => subscription.pays)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @OneToMany(() => PaySubscription, (paySubscription) => paySubscription.pay)
  paySubscriptions: PaySubscription[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { PaySubscription } from 'src/payment/entities/pay-subscription.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'datetime', nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  isPaid: boolean;

  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.movieSubscriptions,
  )
  @Column({ nullable: true })
  subscription: Subscription;

  @Column({ nullable: true })
  subscriptionId: number;

  @OneToMany(() => PaySubscription, (paySubscription) => paySubscription.user)
  @Column({ nullable: true })
  paySubscriptions: PaySubscription[];
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MovieSubscription } from '../../movie-subscription/entities/movie-subscription.entity';
import { Pay } from 'src/payment/entities/pay.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  type: string; // maybe "standard" or "premium"

  @OneToMany(
    () => MovieSubscription,
    (movieSubscription) => movieSubscription.subscription,
  )
  movieSubscriptions: MovieSubscription[];

  @OneToMany(() => Pay, (pay) => pay.subscription)
  pays: Pay[];
}

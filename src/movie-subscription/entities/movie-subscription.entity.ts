import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';

@Entity()
export class MovieSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.movieSubscriptions)
  movie: Movie;

  @Column()
  subscriptionId: number;

  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.movieSubscriptions,
  )
  subscription: Subscription;
}

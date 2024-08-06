import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MovieSubscription } from '../../movie-subscription/entities/movie-subscription.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ type: 'timestamp', nullable: true })
  releaseDate: Date;

  @Column({ type: 'text', nullable: true })
  posterUrl: string;

  @Column({ type: 'text', nullable: true })
  trailerUrl: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @OneToMany(
    () => MovieSubscription,
    (movieSubscription) => movieSubscription.movie,
  )
  movieSubscriptions: MovieSubscription[];
}

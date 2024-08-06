export class CreateMovieDto {
  readonly title?: string;
  readonly description?: string;
  readonly genre?: string;
  readonly releaseDate?: Date;
  readonly posterUrl?: string;
  readonly trailerUrl?: string;
  readonly rating?: number;
}

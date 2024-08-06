import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MovieService', () => {
  let service: MovieService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const expectedMovies = [{ id: 1, title: 'Movie 1' }] as Movie[];
      jest.spyOn(repository, 'find').mockResolvedValue(expectedMovies);

      const result = await service.findAll();
      expect(result).toEqual(expectedMovies);
    });
  });

  describe('findOne', () => {
    it('should return a single movie', async () => {
      const expectedMovie = { id: 1, title: 'Movie 1' } as Movie;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(expectedMovie);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedMovie);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = { title: 'New Movie' };
      const expectedMovie = { id: 1, ...createMovieDto } as Movie;
      jest.spyOn(repository, 'create').mockReturnValue(expectedMovie);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedMovie);

      const result = await service.create(createMovieDto);
      expect(result).toEqual(expectedMovie);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Movie' };
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      await expect(service.update(1, updateMovieDto)).resolves.toBeUndefined();
      expect(repository.update).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should delete a movie', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});

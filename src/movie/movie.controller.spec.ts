import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue(undefined),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result: Movie[] = [{ id: 1, title: 'Movie 1' } as Movie];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single movie', async () => {
      const result = { id: 1, title: 'Movie 1' } as Movie;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = { title: 'New Movie' };
      const result = { id: 1, ...createMovieDto } as Movie;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createMovieDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Movie' };
      jest.spyOn(service, 'update').mockResolvedValue(undefined);

      expect(await controller.update('1', updateMovieDto)).toBeUndefined();
      expect(service.update).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should delete a movie', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: Repository<Subscription>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(Subscription),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    repository = module.get<Repository<Subscription>>(
      getRepositoryToken(Subscription),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of subscriptions', async () => {
      const result: Subscription[] = [
        {
          id: 1,
          type: 'Test',
          movieSubscriptions: [],
          pays: [],
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single subscription', async () => {
      const result: Subscription = {
        id: 1,
        type: 'Test',
        movieSubscriptions: [],
        pays: [],
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a subscription', async () => {
      const createDto: CreateSubscriptionDto = {
        type: 'Test',
      };
      const result: Subscription = {
        id: 1,
        type: 'Test',
        movieSubscriptions: [],
        pays: [],
      } as Subscription;
      jest.spyOn(repository, 'create').mockReturnValue(result);
      jest.spyOn(repository, 'save').mockResolvedValue(result);
      expect(await service.create(createDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a subscription', async () => {
      const updateDto: UpdateSubscriptionDto = {
        type: 'Updated',
      };
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.update(1, updateDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a subscription', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});

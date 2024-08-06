import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of subscriptions', async () => {
      const result: Subscription[] = [
        { id: 1, type: 'Test', movieSubscriptions: [], pays: [] },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single subscription by id', async () => {
      const result: Subscription = {
        id: 1,
        type: 'Test',
        movieSubscriptions: [],
        pays: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a subscription', async () => {
      const createDto: CreateSubscriptionDto = { type: 'Test' };
      const result: Subscription = {
        id: 1,
        type: 'Test',
        movieSubscriptions: [],
        pays: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return the subscription', async () => {
      const updateDto: UpdateSubscriptionDto = { type: 'Updated Test' };
      const result: Subscription = {
        id: 1,
        type: 'Updated Test',
        movieSubscriptions: [],
        pays: [],
      };
      jest.spyOn(service, 'update').mockResolvedValue(undefined);
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toBeUndefined();
      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a subscription', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});

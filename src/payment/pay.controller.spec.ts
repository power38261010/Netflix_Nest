import { Test, TestingModule } from '@nestjs/testing';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { CreatePayDto } from './dto/create-pay.dto';
// import { CreatePaySubscriptionDto } from './dto/create-pay-subscription.dto';
import { Pay } from './entities/pay.entity';
import { PaySubscription } from './entities/pay-subscription.entity';

describe('PayController', () => {
  let controller: PayController;
  let service: PayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayController],
      providers: [
        {
          provide: PayService,
          useValue: {
            createPaySubscription: jest.fn(),
            createPay: jest.fn(),
            getAll: jest.fn(),
            getAllPaySubscriptions: jest.fn(),
            getById: jest.fn(),
            updatePay: jest.fn(),
            deletePay: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PayController>(PayController);
    service = module.get<PayService>(PayService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('createPaySubscription', () => {
  //   it('should create a new pay subscription', async () => {
  //     const createPaySubscriptionDto: CreatePaySubscriptionDto = {
  //       amount: 100,
  //       token: 'test_token',
  //       description: 'test_description',
  //       payerEmail: 'test@example.com',
  //       payId: 1,
  //       userId: 1,
  //       isAnual: false,
  //       payment_method_id: 'visa',
  //       status: '',
  //       paidDate: undefined,
  //     };
  //     const result: PaymentResponse = {
  //       status: 'approved',
  //     };
  //     jest.spyOn(service, 'createPaySubscription').mockResolvedValue(result);
  //     expect(
  //       await controller.createPaySubscription(createPaySubscriptionDto),
  //     ).toBe(result);
  //     expect(service.createPaySubscription).toHaveBeenCalledWith(
  //       createPaySubscriptionDto,
  //     );
  //   });
  // });

  describe('createPay', () => {
    it('should create a new pay', async () => {
      const createPayDto: CreatePayDto = {
        currency: 'OTHER',
        monthlyPayment: 0,
      };

      const result = { id: 1 } as Pay;
      jest.spyOn(service, 'createPay').mockResolvedValue(result);

      expect(await controller.createPay(createPayDto)).toBe(result);
      expect(service.createPay).toHaveBeenCalledWith(createPayDto);
    });
  });

  describe('getAll', () => {
    it('should return an array of pays', async () => {
      const result = [{ id: 1 }] as Pay[];
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      expect(await controller.getAll()).toBe(result);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getAllPaySubscriptions', () => {
    it('should return an array of pay subscriptions', async () => {
      const result = [{ id: 1 }] as PaySubscription[];
      jest.spyOn(service, 'getAllPaySubscriptions').mockResolvedValue(result);

      expect(await controller.getAllPaySubscriptions()).toBe(result);
      expect(service.getAllPaySubscriptions).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a pay by id', async () => {
      const result = { id: 1 } as Pay;
      jest.spyOn(service, 'getById').mockResolvedValue(result);

      expect(await controller.getById(1)).toBe(result);
      expect(service.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('updatePay', () => {
    it('should update a pay', async () => {
      const updatePayDto: CreatePayDto = {
        currency: 'ANY',
        monthlyPayment: 0,
      };

      const result = { id: 1 } as Pay;
      jest.spyOn(service, 'updatePay').mockResolvedValue(result);

      expect(await controller.updatePay(1, updatePayDto)).toBe(result);
      expect(service.updatePay).toHaveBeenCalledWith(1, updatePayDto);
    });
  });

  describe('deletePay', () => {
    it('should delete a pay by id', async () => {
      jest.spyOn(service, 'deletePay').mockResolvedValue();

      expect(await controller.deletePay(1)).toBeUndefined();
      expect(service.deletePay).toHaveBeenCalledWith(1);
    });
  });
});

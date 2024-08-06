import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PayService } from './pay.service';
import { Pay } from './entities/pay.entity';
import { PaySubscription } from './entities/pay-subscription.entity';
import { CreatePayDto } from './dto/create-pay.dto';
import { CreatePaySubscriptionDto } from './dto/create-pay-subscription.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PayService', () => {
  let service: PayService;
  let payRepository: Repository<Pay>;
  let paySubscriptionRepository: Repository<PaySubscription>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayService,
        {
          provide: getRepositoryToken(Pay),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PaySubscription),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'PAYMENT_VALUES_ANNUAL':
                  return 9;
                case 'PAYMENT_VALUES_WITH_INTEREST_RATE':
                  return 1.2;
                case 'MERCADO_PAGO_ACCESS_TOKEN':
                  return 'test_token';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PayService>(PayService);
    payRepository = module.get<Repository<Pay>>(getRepositoryToken(Pay));
    paySubscriptionRepository = module.get<Repository<PaySubscription>>(
      getRepositoryToken(PaySubscription),
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaySubscription', () => {
    it('should create a new pay subscription', async () => {
      const createPaySubscriptionDto: CreatePaySubscriptionDto = {
        amount: 100,
        token: 'test_token',
        description: 'test_description',
        payerEmail: 'test@example.com',
        payId: 1,
        userId: 1,
        isAnual: false,
        payment_method_id: 'visa',
        status: '',
        paidDate: undefined,
      };

      const mockResponse = {
        status: 'approved',
      };

      const mockPayment = {
        create: jest.fn().mockResolvedValue(mockResponse),
      };

      jest.mock('mercadopago', () => ({
        Payment: jest.fn().mockImplementation(() => mockPayment),
      }));

      jest.spyOn(paySubscriptionRepository, 'create').mockReturnValue({
        ...createPaySubscriptionDto,
        status: 'approved',
        paidDate: new Date(),
      } as any);
      jest
        .spyOn(paySubscriptionRepository, 'save')
        .mockResolvedValue({} as any);

      const result = await service.createPaySubscription(
        createPaySubscriptionDto,
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw an HttpException when payment creation fails', async () => {
      const createPaySubscriptionDto: CreatePaySubscriptionDto = {
        amount: 100,
        token: 'test_token',
        description: 'test_description',
        payerEmail: 'test@example.com',
        payId: 1,
        userId: 1,
        isAnual: false,
        payment_method_id: 'visa',
        status: '',
        paidDate: undefined,
      };

      const mockPayment = {
        create: jest
          .fn()
          .mockRejectedValue(new Error('Payment creation failed')),
      };

      jest.mock('mercadopago', () => ({
        Payment: jest.fn().mockImplementation(() => mockPayment),
      }));

      await expect(
        service.createPaySubscription(createPaySubscriptionDto),
      ).rejects.toThrow(
        new HttpException('Payment creation failed', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('createPay', () => {
    it('should create a new pay', async () => {
      const createPayDto: CreatePayDto = {
        currency: '',
        monthlyPayment: 0,
      };

      const mockPay = {
        ...createPayDto,
        id: 1,
      };

      jest.spyOn(payRepository, 'create').mockReturnValue(mockPay as any);
      jest.spyOn(payRepository, 'save').mockResolvedValue(mockPay as any);

      const result = await service.createPay(createPayDto);

      expect(result).toEqual(mockPay);
    });
  });

  describe('getAll', () => {
    it('should return an array of pays', async () => {
      const mockPays = [{ id: 1 }] as Pay[];
      jest.spyOn(payRepository, 'find').mockResolvedValue(mockPays);

      const result = await service.getAll();

      expect(result).toEqual(mockPays);
    });
  });
});

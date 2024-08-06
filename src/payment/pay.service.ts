import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pay } from './entities/pay.entity';
import { PaySubscription } from './entities/pay-subscription.entity';
import { CreatePayDto } from './dto/create-pay.dto';
import { CreatePaySubscriptionDto } from './dto/create-pay-subscription.dto';
import { ConfigService } from '@nestjs/config';
import { Payment } from 'mercadopago';

@Injectable()
export class PayService {
  private annualMultiplier: number;
  private interestRateMultiplier: number;

  constructor(
    @InjectRepository(Pay) private payRepository: Repository<Pay>,
    @InjectRepository(PaySubscription)
    private paySubscriptionRepository: Repository<PaySubscription>,
    private configService: ConfigService,
  ) {
    this.annualMultiplier = this.configService.get<number>(
      'PAYMENT_VALUES_ANNUAL',
    );
    this.interestRateMultiplier = this.configService.get<number>(
      'PAYMENT_VALUES_WITH_INTEREST_RATE',
    );
  }

  async createPaySubscription(
    createPaySubscriptionDto: CreatePaySubscriptionDto,
  ) {
    const {
      amount,
      token,
      description,
      payerEmail,
      payId,
      userId,
      isAnual,
      payment_method_id,
    } = createPaySubscriptionDto;
    const body = {
      transaction_amount: amount,
      token,
      description,
      payment_method_id: payment_method_id,
      payer: { email: payerEmail },
    };

    const payment = new Payment({
      accessToken: this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN'),
    });

    try {
      const response = await payment.create({ body });
      const dateNow = new Date();
      const paySubscription = this.paySubscriptionRepository.create({
        isAnual,
        payerEmail,
        token,
        description,
        status: response.status,
        paidDate: dateNow,
        amount,
        pay: { id: payId },
        user: { id: userId },
      });

      await this.paySubscriptionRepository.save(paySubscription);

      return response;
    } catch (error) {
      throw new HttpException(
        'Payment creation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPay(createPayDto: CreatePayDto): Promise<Pay> {
    const pay = this.payRepository.create(createPayDto);
    return this.payRepository.save(pay);
  }

  async getAll(): Promise<Pay[]> {
    return this.payRepository.find({ relations: ['subscription'] });
  }

  async getAllPaySubscriptions(): Promise<PaySubscription[]> {
    return this.paySubscriptionRepository.find({ relations: ['pay', 'user'] });
  }

  async getById(id: number): Promise<Pay> {
    return this.payRepository.findOne({
      where: { id },
      relations: ['subscription'],
    });
  }

  async updatePay(id: number, updatePayDto: CreatePayDto): Promise<Pay> {
    await this.payRepository.update(id, updatePayDto);
    return this.getById(id);
  }

  async deletePay(id: number): Promise<void> {
    await this.payRepository.delete(id);
  }

  calculateAnnualPayment(monthlyPayment: number): number {
    return monthlyPayment * this.annualMultiplier;
  }

  calculateInterestRatePayment(monthlyPayment: number): number {
    return monthlyPayment * this.interestRateMultiplier;
  }

  async getPaysByCurrency(currency: string): Promise<Pay[]> {
    return this.payRepository.find({
      where: { currency },
      relations: ['subscription'],
    });
  }
}

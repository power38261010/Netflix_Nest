import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PayService } from './pay.service';
import { CreatePayDto } from './dto/create-pay.dto';
import { CreatePaySubscriptionDto } from './dto/create-pay-subscription.dto';
import { Pay } from './entities/pay.entity';
import { PaySubscription } from './entities/pay-subscription.entity';

@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('subscription')
  async createPaySubscription(
    @Body() createPaySubscriptionDto: CreatePaySubscriptionDto,
  ): Promise<any> {
    return this.payService.createPaySubscription(createPaySubscriptionDto);
  }

  @Post()
  async createPay(@Body() createPayDto: CreatePayDto): Promise<Pay> {
    return this.payService.createPay(createPayDto);
  }

  @Get()
  async getAll(): Promise<Pay[]> {
    return this.payService.getAll();
  }

  @Get('subscriptions')
  async getAllPaySubscriptions(): Promise<PaySubscription[]> {
    return this.payService.getAllPaySubscriptions();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Pay> {
    return this.payService.getById(id);
  }

  @Put(':id')
  async updatePay(
    @Param('id') id: number,
    @Body() updatePayDto: CreatePayDto,
  ): Promise<Pay> {
    return this.payService.updatePay(id, updatePayDto);
  }

  @Delete(':id')
  async deletePay(@Param('id') id: number): Promise<void> {
    return this.payService.deletePay(id);
  }
}

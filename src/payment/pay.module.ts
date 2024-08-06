import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from './entities/pay.entity';
import { PaySubscription } from './entities/pay-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pay,PaySubscription])],
  controllers: [PayController],
  providers: [PayService],
  exports: [PayService],
})
export class PaymentModule {}

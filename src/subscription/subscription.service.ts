import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepository.find();
  }

  findOne(id: number): Promise<Subscription> {
    return this.subscriptionsRepository.findOneBy({ id });
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = this.subscriptionsRepository.create(
      createSubscriptionDto,
    );
    return this.subscriptionsRepository.save(subscription);
  }

  async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<void> {
    await this.subscriptionsRepository.update(id, updateSubscriptionDto);
  }

  async remove(id: number): Promise<void> {
    await this.subscriptionsRepository.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  async register(
    username: string,
    passwordHash: string,
    email?: string,
    subscriptionId?: number,
  ) {
    const expirationDate =
      subscriptionId === 1 ? this.addDays(30) : this.addDays(15);
    const user: CreateUserDto = {
      username,
      passwordHash,
      email,
      subscriptionId,
      expirationDate,
      isPaid: true,
    };
    return await this.create(user);
  }
  addDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };
  authenticate(username: string, passwordHash: string) {
    return this.usersRepository.findOne({
      where: [{ username }, { passwordHash }],
      relations: ['subscription'],
    });
  }
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['subscription'] });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['subscription'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

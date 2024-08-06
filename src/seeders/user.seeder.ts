import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class UserSeeder {
  constructor(private readonly userService: UserService) {}

  async seed() {
    const users = [
      {
        id: 1,
        username: 'user1',
        passwordHash: 'pass1',
        email: 'user1@example.com',
        role: 'admin',
      },
      {
        id: 2,
        username: 'user2',
        passwordHash: 'pass2',
        email: 'user2@example.com',
        role: 'user',
      },
    ];

    for (const user of users) {
      await this.userService.create(user);
    }
  }
}

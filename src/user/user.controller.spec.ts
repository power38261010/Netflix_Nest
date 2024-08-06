import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          id: 1,
          username: 'testuser1',
          passwordHash: 'testpasswordhash1',
          email: 'test1@example.com',
          role: 'user',
          expirationDate: new Date(),
          isPaid: true,
          subscriptionId: 1,
          subscription: null,
          paySubscriptions: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result: User = {
        id: 1,
        username: 'testuser1',
        passwordHash: 'testpasswordhash1',
        email: 'test1@example.com',
        role: 'user',
        expirationDate: new Date(),
        isPaid: true,
        subscriptionId: 1,
        subscription: null,
        paySubscriptions: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  // describe('create', () => {
  //   it('should create and return a user', async () => {
  //     const createUserDto: CreateUserDto = {
  //       username: 'testuser',
  //       passwordHash: 'testpasswordhash',
  //       email: 'test@example.com',
  //       subscriptionId: 1,
  //       expirationDate: new Date(),
  //       isPaid: true,
  //     };

  //     const result: User = {
  //       id: 1,
  //       ...createUserDto,
  //       role: 'user',
  //       subscription: null,
  //       paySubscriptions: [],
  //     };

  //     jest.spyOn(service, 'create').mockResolvedValue(result);

  //     expect(await controller.create(createUserDto)).toBe(result);
  //   });
  // });

  describe('update', () => {
    it('should update and return nothing', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
      };

      jest.spyOn(service, 'update').mockResolvedValue(undefined);

      await controller.update('1', updateUserDto);

      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

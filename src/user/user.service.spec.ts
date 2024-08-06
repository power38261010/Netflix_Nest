import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Subscription } from 'src/subscription/entities/subscription.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('register', () => {
  //   it('should register and return a user', async () => {
  //     const createUserDto: CreateUserDto = {
  //       username: 'testuser',
  //       passwordHash: 'testpasswordhash',
  //       email: 'test@example.com', // `email` ahora es obligatorio
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

  //     jest.spyOn(repository, 'save').mockResolvedValue(result);
  //     jest.spyOn(service, 'create').mockResolvedValue(result);

  //     expect(
  //       await service.register(
  //         createUserDto.username,
  //         createUserDto.passwordHash,
  //         createUserDto.email,
  //         createUserDto.subscriptionId,
  //       ),
  //     ).toBe(result);
  //   });
  // });

  describe('authenticate', () => {
    it('should authenticate and return a user', async () => {
      const username = 'testuser';
      const passwordHash = 'testpasswordhash';
      const result: User = {
        id: 1,
        username,
        passwordHash,
        email: 'test@example.com',
        subscription: null,
        role: '',
        expirationDate: undefined,
        isPaid: false,
        subscriptionId: 0,
        paySubscriptions: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.authenticate(username, passwordHash)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          id: 1,
          username: 'testuser1',
          passwordHash: 'testpasswordhash1',
          email: 'test1@example.com',
          subscription: null,
          role: '',
          expirationDate: undefined,
          isPaid: false,
          subscriptionId: 0,
          paySubscriptions: [],
        },
        {
          id: 2,
          username: 'testuser2',
          passwordHash: 'testpasswordhash2',
          email: 'test2@example.com',
          subscription: null,
          role: '',
          expirationDate: undefined,
          isPaid: false,
          subscriptionId: 0,
          paySubscriptions: [],
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const result: User = {
        id: 1,
        username: 'testuser',
        passwordHash: 'testpasswordhash',
        email: 'test@example.com',
        subscription: null,
        role: '',
        expirationDate: undefined,
        isPaid: false,
        subscriptionId: 0,
        paySubscriptions: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
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
  //       subscriptionId: 1,
  //       paySubscriptions: [],
  //       role: '',
  //       subscription: new Subscription(),
  //     };

  //     jest.spyOn(repository, 'create').mockReturnValue(result);
  //     jest.spyOn(repository, 'save').mockResolvedValue(result);

  //     expect(await service.create(createUserDto)).toBe(result);
  //   });
  // });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      await service.update(1, updateUserDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});

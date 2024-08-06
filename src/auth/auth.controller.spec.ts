import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateJwtToken: jest.fn(),
            validateJwtToken: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            authenticate: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token and profile if credentials are correct', async () => {
      const mockUser: User = {
        username: 'testuser',
        role: 'user',
        id: 0,
        passwordHash: '',
        email: '',
        expirationDate: undefined,
        isPaid: false,
        subscription: new Subscription(),
        subscriptionId: 0,
        paySubscriptions: [],
      };
      const mockToken = 'mockToken';
      jest.spyOn(userService, 'authenticate').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'generateJwtToken').mockResolvedValue(mockToken);

      const result = await controller.login(
        { username: 'testuser', passwordHash: 'testpassword' },
        {
          json: jest
            .fn()
            .mockReturnValue({ token: mockToken, profile: mockUser }),
        } as any,
      );

      expect(result).toEqual({ token: mockToken, profile: mockUser });
    });
  });

  describe('register', () => {
    it('should return a token and profile if registration is successful', async () => {
      const mockUser: User = {
        username: 'testuser',
        role: 'user',
        id: 0,
        passwordHash: '',
        email: '',
        expirationDate: undefined,
        isPaid: false,
        subscription: new Subscription(),
        subscriptionId: 0,
        paySubscriptions: [],
      };
      const mockToken = 'mockToken';
      jest.spyOn(userService, 'register').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'generateJwtToken').mockResolvedValue(mockToken);

      const result = await controller.register(
        {
          username: 'testuser',
          passwordHash: 'testpassword',
          email: 'test@example.com',
        },
        {
          json: jest
            .fn()
            .mockReturnValue({ token: mockToken, profile: mockUser }),
        } as any,
      );

      expect(result).toEqual({ token: mockToken, profile: mockUser });
    });
  });

  describe('validateJwt', () => {
    it('should return true if JWT is valid', async () => {
      jest.spyOn(authService, 'validateJwtToken').mockResolvedValue(true);
      const mockRes = {
        json: jest.fn().mockReturnValue({ isValidated: true }),
      };
      const result = await controller.validateJwt(
        { token: 'validToken' },
        {},
        mockRes as any,
      );
      expect(result).toEqual({ isValidated: true });
    });
  });

  describe('logout', () => {
    it('should return a success message if logout is successful', async () => {
      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      const result = await controller.logout(
        { headers: { authorization: 'Bearer mockToken' } } as any,
        {
          json: jest
            .fn()
            .mockReturnValue({ message: 'Logged out successfully' }),
        } as any,
      );

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});

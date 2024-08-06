import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TokenPayload } from './interfaces/token-payload.interface';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  // let userService: UserService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            authenticate: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    // userService = module.get<UserService>(UserService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateJwtToken', () => {
    it('should generate and cache a JWT token', async () => {
      const payload: TokenPayload = { username: 'testuser', role: 'user' };
      const token = 'testtoken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await service.generateJwtToken(
        payload.username,
        payload.role,
      );

      expect(result).toBe(token);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '3d',
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        token,
        true,
        60 * 60 * 24 * 3,
      );
    });
  });

  describe('validateJwtToken', () => {
    it('should return true for a valid token', async () => {
      const token = 'validToken';
      jest.spyOn(cacheManager, 'get').mockResolvedValue(true);
      jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ username: 'testuser', role: 'user' });

      const result = await service.validateJwtToken(token);

      expect(result).toBe(true);
      expect(cacheManager.get).toHaveBeenCalledWith(token);
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_SECRET,
      });
    });

    it('should return false for an invalid token', async () => {
      const token = 'invalidToken';
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

      const result = await service.validateJwtToken(token);

      expect(result).toBe(false);
      expect(cacheManager.get).toHaveBeenCalledWith(token);
    });
  });

  describe('getUserClaimsFromToken', () => {
    it('should return the user claims from a valid token', async () => {
      const token = 'validToken';
      const payload: TokenPayload = { username: 'testuser', role: 'user' };
      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

      const result = await service.getUserClaimsFromToken(token);

      expect(result).toEqual(payload);
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_SECRET,
      });
    });
  });

  describe('logout', () => {
    it('should remove the cached token', async () => {
      const token = 'testtoken';
      jest.spyOn(cacheManager, 'del').mockResolvedValue(undefined);

      await service.logout(token);

      expect(cacheManager.del).toHaveBeenCalledWith(token);
    });
  });
});

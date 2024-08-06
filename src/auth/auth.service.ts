import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from '../user/user.service';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async generateJwtToken(username: string, role: string): Promise<string> {
    const payload: TokenPayload = { username, role };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '3d',
    });

    await this.cacheToken(token);
    return token;
  }

  async validateJwtToken(token: string): Promise<boolean> {
    if (!token || !(await this.cacheManager.get(token))) {
      return false;
    }

    try {
      this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      return true;
    } catch {
      return false;
    }
  }

  async getUserClaimsFromToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verify<TokenPayload>(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async logout(token: string): Promise<void> {
    await this.removeCachedToken(token);
  }

  private async cacheToken(token: string): Promise<void> {
    await this.cacheManager.set(token, true, 60 * 60 * 24 * 3); // 3 days
  }

  private async removeCachedToken(token: string): Promise<void> {
    await this.cacheManager.del(token);
  }
}

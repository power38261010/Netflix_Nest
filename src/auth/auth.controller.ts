import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthRequest } from './dto/auth-request.dto';
import { UserRequest } from '../user/dto/create-user.dto';
import { TokenRequest } from './dto/token-request.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: AuthRequest, @Res() res: Response) {
    try {
      const user = this.userService.authenticate(
        credentials.username,
        credentials.passwordHash,
      );
      if (!user || !(await user).role) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Usuario y/o Contraseña Incorrecto/s' });
      }

      const token = await this.authService.generateJwtToken(
        (await user).username,
        (await user).role,
      );
      return res.json({ token, profile: user });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() user: UserRequest, @Res() res: Response) {
    try {
      const subscriptionId = user.subscriptionId || 0;
      const registeredUser = await this.userService.register(
        user.username,
        user.passwordHash,
        user.email,
        subscriptionId,
      );
      const token = await this.authService.generateJwtToken(
        registeredUser.username,
        registeredUser.role,
      );
      return res.json({ token, profile: registeredUser });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-jwt')
  @HttpCode(HttpStatus.OK)
  async validateJwt(
    @Body()
    request: TokenRequest,
    _p0: object,
    @Res()
    res: Response,
  ) {
    const validated = await this.authService.validateJwtToken(request.token);
    return res.json({ isValidated: validated });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
      await this.authService.logout(token);
      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}

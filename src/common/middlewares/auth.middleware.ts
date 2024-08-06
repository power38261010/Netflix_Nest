import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, 'secretKey');
      req['user'] = decoded;
      next();
    } catch (error) {
      return res.status(403).send('Unauthorized');
    }
  }
}

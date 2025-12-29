import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          messge: 'Unauthorized access',
        });
      }
      const token = authHeader?.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(token);
      req['User'] = payload;
      next();
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized access',
      });
    }
  }
}

import { AuthMiddleware } from './auth.middleware';
import { JwtService } from '@nestjs/jwt';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    const mockJwtService = {} as JwtService;
    expect(new AuthMiddleware(mockJwtService)).toBeDefined();
  });
});
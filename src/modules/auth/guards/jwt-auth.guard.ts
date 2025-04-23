import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload';

declare module 'express' {
  interface Request {
    user?: JwtPayload;
    cookies: {
      access_token?: string;
      refresh_token?: string;
    };
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
  private extractToken(request: Request): string | undefined {
    const token: string =
      request.cookies?.access_token ||
      request.headers.authorization?.split(' ')[1];
    return token ?? undefined;
  }
}

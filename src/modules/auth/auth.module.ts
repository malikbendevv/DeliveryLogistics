import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],

  controllers: [AuthController],
  providers: [UsersService, PrismaService, AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService, JwtAuthGuard],
})
export class UsersModule {}

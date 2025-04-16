import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PrismaService } from 'src/shared/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

type UserCreateResponse = {
  id: string;
  email: string;
  firstName: string;
  // Add other fields you SELECT
};

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  // Create

  async create(dto: CreateUserDto): Promise<UserCreateResponse> {
    const { email, phoneNumber, firstName, password, ...rest } = dto;

    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { phoneNumber }],
        },
        select: {
          email: true,
          phoneNumber: true,
        },
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser?.email === email ? 'Email taken' : 'Phone taken',
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          email,
          phoneNumber,
          firstName,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
        },
      });

      return user;
    } catch (err) {
      this.logger.error('Error Creating user :', err);
      throw err;
    }
  }

  async findAll(skip = 0, take = 10) {
    return await this.prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ---- UPDATE ----
  async update(id: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto?.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // ✅ Use try/catch for critical operations (e.g., delete)
  async delete(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return {
      status: 'success',
      message: `User ${id} deleted`,
      timestamp: new Date(),
    };
  }
}

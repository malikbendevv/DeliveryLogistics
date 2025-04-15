import {
  Injectable,
  ConflictException,
  NotFoundException,
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
  constructor(private prisma: PrismaService) {}

  // Create

  async createUser(dto: CreateUserDto): Promise<UserCreateResponse> {
    const { email, phoneNumber, firstName, password, ...rest } = dto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
      select: {
        email: true,
        phoneNumber: true,
        firstName: true,
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
  }

  findAll() {
    return `This action returns all users`;
  }

  async findUserByEmail(email: string): Promise<UserCreateResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ---- UPDATE ----
  async updateUser(id: string, dto: UpdateUserDto) {
    if (dto?.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true }, // Filter output
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

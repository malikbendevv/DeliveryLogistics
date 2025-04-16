// src/users/dto/user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'a1b2c3d4', description: 'Auto-generated UUID' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Must be unique' })
  email: string;

  @ApiProperty({ example: 'John', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  lastName?: string;

  @ApiProperty({
    example: '+213123456789',
    description: 'Algerian format: +213XXXXXXXXX',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'customer',
    enum: ['customer', 'driver', 'admin'],
    default: 'customer',
  })
  role: string;
}

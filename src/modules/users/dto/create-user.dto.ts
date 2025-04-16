// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Matches,
  NotContains,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least 1 lowercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least 1 number',
  })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least 1 special character',
  })
  @NotContains(' ', {
    message: 'Password must not contain spaces',
  })
  password: string;

  @IsString({ message: 'First name must be text' })
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(50, {
    message: 'First name cannot exceed 50 characters',
  })
  firstName: string;

  @IsString({ message: 'Last name must be text' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[\d\s\-()]{8,}$/, {
    message: 'Enter a valid phone number (e.g., +1234567890 or 123-456-7890)',
  })
  phoneNumber: string;

  @IsString({ message: 'Address must be text' })
  @MaxLength(200)
  @IsOptional()
  address?: string | null;
}

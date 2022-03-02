import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsDateString,
  IsEmail,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsAlpha()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  lastname: string;

  @ApiProperty()
  @IsAlphanumeric()
  username: string;

  @ApiProperty()
  @IsDateString()
  dob: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

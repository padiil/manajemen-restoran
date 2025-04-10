import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Jabatan } from '@prisma/client';

export class CreateKaryawanDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsEnum(Jabatan, {
    message: `jabatan must be one of the following values: ${Object.values(Jabatan).join(', ')}`,
  })
  jabatan: Jabatan;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;
}

import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Jabatan } from '@prisma/client';

export class UpdateKaryawanDto {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsEnum(Jabatan, {
    message: `jabatan must be one of the following values: ${Object.values(Jabatan).join(', ')}`,
  })
  jabatan?: Jabatan;
}

import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { StatusPesanan } from '@prisma/client';

export class UpdatePesananDto {
  @IsOptional()
  @IsNumber()
  kokiId?: number;

  @IsOptional()
  @IsEnum(StatusPesanan)
  status?: StatusPesanan;
}
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateMenuDto {
    @IsOptional()
    @IsString()
    nama?: string;

    @IsOptional()
    @IsString()
    deskripsi?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    harga?: number;
}
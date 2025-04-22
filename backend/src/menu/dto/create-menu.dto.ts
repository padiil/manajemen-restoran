import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMenuDto {
    @IsNotEmpty()
    @IsString()
    nama: string;

    @IsOptional()
    @IsString()
    deskripsi?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    harga: number;
}
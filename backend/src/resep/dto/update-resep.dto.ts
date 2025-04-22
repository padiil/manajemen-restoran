import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateResepDto {
    @IsOptional()
    @IsString()
    idProduk?: string;

    @IsOptional()
    @IsNumber()
    idBahan?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    kuantitas?: number;

    @IsOptional()
    @IsString()
    satuanPakai?: string;
}
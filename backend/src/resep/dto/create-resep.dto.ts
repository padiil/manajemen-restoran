import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateResepDto {
    @IsNotEmpty()
    @IsString()
    idProduk: string;

    @IsNotEmpty()
    @IsNumber()
    idBahan: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    kuantitas: number;

    @IsNotEmpty()
    @IsString()
    satuanPakai: string;
}
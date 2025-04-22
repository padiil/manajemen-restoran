import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreatePembayaranDto {
    @IsNotEmpty()
    @IsString()
    idPesanan: string;

    @IsNotEmpty()
    @IsString()
    metode: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    jumlah: number;
}
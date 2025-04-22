import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateStokDto {
    @IsNotEmpty()
    @IsString()
    namaBahan: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    jumlah: number;

    @IsNotEmpty()
    @IsString()
    satuan: string;
}
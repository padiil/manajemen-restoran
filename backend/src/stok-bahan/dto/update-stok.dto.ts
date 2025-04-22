import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateStokDto {
    @IsOptional()
    @IsString()
    namaBahan?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    jumlah?: number;

    @IsOptional()
    @IsString()
    satuan?: string;
}
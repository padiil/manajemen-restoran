import { IsOptional, IsString } from 'class-validator';

export class GetLaporanDto {
    @IsOptional()
    @IsString()
    jenis?: 'harian' | 'mingguan' | 'bulanan' | 'tahunan';

    @IsOptional()
    @IsString()
    tanggal?: string; // Format YYYY-MM-DD untuk harian, YYYY-MM untuk bulanan, YYYY untuk tahunan

    @IsOptional()
    @IsString()
    periodeMulai?: string; // Untuk laporan mingguan/custom
    @IsOptional()
    @IsString()
    periodeSelesai?: string; // Untuk laporan mingguan/custom
}
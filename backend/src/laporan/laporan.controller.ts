import { Controller, Get, Query, HttpStatus, HttpException } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { GetLaporanDto } from './dto/laporan.dto';

@Controller('laporan')
export class LaporanController {
    constructor(private readonly laporanService: LaporanService) { }

    @Get()
    async getLaporan(@Query() query: GetLaporanDto) {
        if (!query.jenis) {
            throw new HttpException('Jenis laporan harus ditentukan', HttpStatus.BAD_REQUEST);
        }

        // Validasi format tanggal/periode (sederhana)
        if (query.jenis === 'harian' && !/^\d{4}-\d{2}-\d{2}$/.test(query.tanggal || '')) {
            throw new HttpException('Format tanggal harian harus YYYY-MM-DD', HttpStatus.BAD_REQUEST);
        }
        if (query.jenis === 'bulanan' && !/^\d{4}-\d{2}$/.test(query.tanggal || '')) {
            throw new HttpException('Format tanggal bulanan harus YYYY-MM', HttpStatus.BAD_REQUEST);
        }
        if (query.jenis === 'tahunan' && !/^\d{4}$/.test(query.tanggal || '')) {
            throw new HttpException('Format tahunan harus YYYY', HttpStatus.BAD_REQUEST);
        }
        if (query.jenis === 'mingguan' && (!/^\d{4}-\d{2}-\d{2}$/.test(query.periodeMulai || '') || !/^\d{4}-\d{2}-\d{2}$/.test(query.periodeSelesai || ''))) {
            throw new HttpException('Format periode mingguan harus YYYY-MM-DD untuk periodeMulai dan periodeSelesai', HttpStatus.BAD_REQUEST);
        }

        try {
            return await this.laporanService.generateLaporan(query);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
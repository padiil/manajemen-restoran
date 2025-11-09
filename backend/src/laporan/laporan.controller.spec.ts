import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LaporanController } from './laporan.controller';
import { LaporanService } from './laporan.service';
import { GetLaporanDto } from './dto/laporan.dto';

describe('LaporanController', () => {
  let controller: LaporanController;
  let service: LaporanService;

  const serviceMock = {
    generateLaporan: jest.fn(),
  } satisfies Partial<LaporanService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaporanController],
      providers: [{ provide: LaporanService, useValue: serviceMock }],
    }).compile();

    controller = module.get<LaporanController>(LaporanController);
    service = module.get<LaporanService>(LaporanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject when jenis missing', async () => {
    await expect(controller.getLaporan({} as GetLaporanDto)).rejects.toThrow(
      new HttpException('Jenis laporan harus ditentukan', HttpStatus.BAD_REQUEST),
    );
  });

  it('should validate harian date format', async () => {
    const query = { jenis: 'harian', tanggal: '2025/01/01' } as GetLaporanDto;

    await expect(controller.getLaporan(query)).rejects.toThrow(
      new HttpException('Format tanggal harian harus YYYY-MM-DD', HttpStatus.BAD_REQUEST),
    );
  });

  it('should validate bulanan format', async () => {
    const query = { jenis: 'bulanan', tanggal: '2025-1' } as GetLaporanDto;

    await expect(controller.getLaporan(query)).rejects.toThrow(
      new HttpException('Format tanggal bulanan harus YYYY-MM', HttpStatus.BAD_REQUEST),
    );
  });

  it('should validate tahunan format', async () => {
    const query = { jenis: 'tahunan', tanggal: '25' } as GetLaporanDto;

    await expect(controller.getLaporan(query)).rejects.toThrow(
      new HttpException('Format tahunan harus YYYY', HttpStatus.BAD_REQUEST),
    );
  });

  it('should validate mingguan period format', async () => {
    const query = { jenis: 'mingguan', periodeMulai: '2025-01-01', periodeSelesai: '2025/01/07' } as GetLaporanDto;

    await expect(controller.getLaporan(query)).rejects.toThrow(
      new HttpException('Format periode mingguan harus YYYY-MM-DD untuk periodeMulai dan periodeSelesai', HttpStatus.BAD_REQUEST),
    );
  });

  it('should delegate to service when validation passes', async () => {
    const query = { jenis: 'harian', tanggal: '2025-01-01' } as GetLaporanDto;
    const laporan = { data: 'laporan' } as any;
    service.generateLaporan = jest.fn().mockResolvedValue(laporan);

    await expect(controller.getLaporan(query)).resolves.toEqual(laporan);
    expect(service.generateLaporan).toHaveBeenCalledWith(query);
  });

  it('should wrap service errors into HttpException', async () => {
    const query = { jenis: 'harian', tanggal: '2025-01-01' } as GetLaporanDto;
    const error = new Error('Service down');
    service.generateLaporan = jest.fn().mockRejectedValue(error);

    await expect(controller.getLaporan(query)).rejects.toThrow(
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});

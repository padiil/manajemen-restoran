import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LaporanService', () => {
  let service: LaporanService;

  const prismaMock = {
    pembayaran: {
      aggregate: jest.fn(),
    },
    pengeluaran: {
      aggregate: jest.fn(),
    },
    snapshotStokBahan: {
      findMany: jest.fn(),
    },
    orderItem: {
      groupBy: jest.fn(),
    },
    resep: {
      findMany: jest.fn(),
    },
    pesanan: {
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    produk: {
      findMany: jest.fn(),
    },
  } as unknown as PrismaService & {
    pembayaran: { aggregate: jest.Mock };
    pengeluaran: { aggregate: jest.Mock };
    snapshotStokBahan: { findMany: jest.Mock };
    orderItem: { groupBy: jest.Mock };
    resep: { findMany: jest.Mock };
    pesanan: { count: jest.Mock; aggregate: jest.Mock };
    produk: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LaporanService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<LaporanService>(LaporanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateLaporan', () => {
    it('should delegate to harian laporan', async () => {
      const spy = jest.spyOn(service, 'getLaporanHarian').mockResolvedValue('harian' as any);
      await expect(service.generateLaporan({ jenis: 'harian', tanggal: '2025-01-01' })).resolves.toEqual('harian');
      expect(spy).toHaveBeenCalledWith('2025-01-01');
    });

    it('should delegate to mingguan laporan', async () => {
      const spy = jest.spyOn(service, 'getLaporanMingguan').mockResolvedValue('mingguan' as any);
      await expect(service.generateLaporan({ jenis: 'mingguan', periodeMulai: '2025-01-01', periodeSelesai: '2025-01-07' })).resolves.toEqual('mingguan');
      expect(spy).toHaveBeenCalledWith('2025-01-01', '2025-01-07');
    });

    it('should handle invalid jenis', async () => {
      await expect(service.generateLaporan({ jenis: 'invalid' } as any)).resolves.toEqual({ message: 'Jenis laporan tidak valid' });
    });

    it('should wrap errors while generating laporan', async () => {
      jest.spyOn(service, 'getLaporanHarian').mockRejectedValue(new Error('fail'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      await expect(service.generateLaporan({ jenis: 'harian', tanggal: '2025-01-01' })).rejects.toBeInstanceOf(InternalServerErrorException);

      consoleSpy.mockRestore();
    });
  });

  it('should compute laporan keuangan', async () => {
    prismaMock.pembayaran.aggregate.mockResolvedValue({ _sum: { jumlah: 200_000 } });
    prismaMock.pengeluaran.aggregate.mockResolvedValue({ _sum: { jumlah: 50_000 } });

    const start = new Date('2025-01-01');
    const end = new Date('2025-01-07');

    await expect(service.getLaporanKeuangan(start, end)).resolves.toEqual({
      totalPendapatan: 200_000,
      totalPengeluaran: 50_000,
      labaBersih: 150_000,
    });

    expect(prismaMock.pembayaran.aggregate).toHaveBeenCalled();
    expect(prismaMock.pengeluaran.aggregate).toHaveBeenCalled();
  });

  it('should compute laporan stok', async () => {
    prismaMock.snapshotStokBahan.findMany
      .mockResolvedValueOnce([
        { idStok: 1, jumlah: 10, tanggal: new Date('2025-01-01'), stok: { namaBahan: 'Bahan A', satuan: 'kg' } },
      ])
      .mockResolvedValueOnce([
        { idStok: 1, jumlah: 5, tanggal: new Date('2025-01-05'), stok: { namaBahan: 'Bahan A', satuan: 'kg' } },
      ]);
    prismaMock.orderItem.groupBy.mockResolvedValue([]);

    const laporan = await service.getLaporanStok(new Date('2025-01-01'), new Date('2025-01-07'));

    expect(laporan.stokAwal).toEqual([{ namaBahan: 'Bahan A', jumlah: 10, satuan: 'kg' }]);
    expect(laporan.stokAkhir).toEqual([{ namaBahan: 'Bahan A', jumlah: 5, satuan: 'kg' }]);
    expect(laporan.perubahanStok).toEqual([{ namaBahan: 'Bahan A', perubahan: -5, satuan: 'kg' }]);
    expect(laporan.bahanTerbanyakDigunakan).toEqual({});
  });

  it('should compute laporan pesanan', async () => {
    prismaMock.pesanan.count.mockResolvedValue(2);
    prismaMock.pesanan.aggregate.mockResolvedValue({ _sum: { totalHarga: 500_000 } });
    prismaMock.orderItem.groupBy.mockResolvedValue([]);
    prismaMock.produk.findMany.mockResolvedValue([]);

    const laporan = await service.getLaporanPesanan(new Date('2025-01-01'), new Date('2025-01-07'));

    expect(laporan).toEqual({
      jumlahPesanan: 2,
      totalNilaiPesanan: 500_000,
      rataRataNilaiPesanan: 250_000,
      itemTerlaris: [],
    });
  });
});

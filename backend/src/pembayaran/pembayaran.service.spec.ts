import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PembayaranService } from './pembayaran.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PembayaranService', () => {
  let service: PembayaranService;

  const prismaMock = {
    pesanan: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    pembayaran: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService & {
    pesanan: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    pembayaran: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PembayaranService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PembayaranService>(PembayaranService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dtoBase = {
      idPesanan: 'order-1',
      metode: 'TUNAI',
      jumlah: 120000,
    } as any;

    it('should create pembayaran and update pesanan status', async () => {
      const pesanan = { id: 'order-1', totalHarga: 100000 } as any;
      const pembayaran = { id: 'pay-1', kembalian: 20000 } as any;
      prismaMock.pesanan.findUnique.mockResolvedValue(pesanan);
      prismaMock.pembayaran.create.mockResolvedValue(pembayaran);
      prismaMock.pesanan.update.mockResolvedValue({});
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

      await expect(service.create(dtoBase)).resolves.toEqual(pembayaran);

      expect(prismaMock.pesanan.findUnique).toHaveBeenCalledWith({ where: { id: dtoBase.idPesanan } });
      expect(prismaMock.pembayaran.create).toHaveBeenCalledWith({
        data: {
          metode: dtoBase.metode,
          jumlah: dtoBase.jumlah,
          kembalian: 20000,
          pesanan: { connect: { id: dtoBase.idPesanan } },
        },
      });
      expect(prismaMock.pesanan.update).toHaveBeenCalledWith({
        where: { id: dtoBase.idPesanan },
        data: { status: 'DIBAYAR' },
      });

      consoleSpy.mockRestore();
    });

    it('should throw when pesanan not found', async () => {
      prismaMock.pesanan.findUnique.mockResolvedValue(null);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      await expect(service.create(dtoBase)).rejects.toBeInstanceOf(BadRequestException);

      consoleSpy.mockRestore();
    });

    it('should throw when jumlah kurang dari total harga', async () => {
      const pesanan = { id: 'order-1', totalHarga: 200000 } as any;
      prismaMock.pesanan.findUnique.mockResolvedValue(pesanan);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      await expect(service.create({ ...dtoBase, jumlah: 100000 })).rejects.toBeInstanceOf(BadRequestException);

      consoleSpy.mockRestore();
    });

    it('should rethrow unexpected errors', async () => {
      const pesanan = { id: 'order-1', totalHarga: 100000 } as any;
      prismaMock.pesanan.findUnique.mockResolvedValue(pesanan);
      const error = new Error('unexpected');
      prismaMock.pembayaran.create.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      await expect(service.create(dtoBase)).rejects.toThrow(error);

      consoleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return list of pembayaran', async () => {
      const list = [{ id: 'pay-1' }] as any;
      prismaMock.pembayaran.findMany.mockResolvedValue(list);

      await expect(service.findAll()).resolves.toEqual(list);
    });

    it('should wrap errors in InternalServerErrorException', async () => {
      prismaMock.pembayaran.findMany.mockRejectedValue(new Error('fail'));

      await expect(service.findAll()).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return pembayaran by id', async () => {
      const entity = { id: 'pay-1' } as any;
      prismaMock.pembayaran.findUnique.mockResolvedValue(entity);

      await expect(service.findOne('pay-1')).resolves.toEqual(entity);
      expect(prismaMock.pembayaran.findUnique).toHaveBeenCalledWith({ where: { id: 'pay-1' } });
    });

    it('should wrap errors on failure', async () => {
      prismaMock.pembayaran.findUnique.mockRejectedValue(new Error('fail'));

      await expect(service.findOne('pay-1')).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findByPesananId', () => {
    it('should return pembayaran by pesanan id', async () => {
      const entity = { id: 'pay-1' } as any;
      prismaMock.pembayaran.findUnique.mockResolvedValue(entity);

      await expect(service.findByPesananId('order-1')).resolves.toEqual(entity);
      expect(prismaMock.pembayaran.findUnique).toHaveBeenCalledWith({ where: { orderId: 'order-1' } });
    });

    it('should wrap errors on failure', async () => {
      prismaMock.pembayaran.findUnique.mockRejectedValue(new Error('fail'));

      await expect(service.findByPesananId('order-1')).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should delete pembayaran', async () => {
      const removed = { id: 'pay-1' } as any;
      prismaMock.pembayaran.delete.mockResolvedValue(removed);

      await expect(service.remove('pay-1')).resolves.toEqual(removed);
      expect(prismaMock.pembayaran.delete).toHaveBeenCalledWith({ where: { id: 'pay-1' } });
    });

    it('should wrap errors on failure', async () => {
      prismaMock.pembayaran.delete.mockRejectedValue(new Error('fail'));

      await expect(service.remove('pay-1')).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
});

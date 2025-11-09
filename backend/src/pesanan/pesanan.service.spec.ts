import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PesananService', () => {
  let service: PesananService;
  const prismaMock = {
    produk: {
      findUnique: jest.fn(),
    },
    pesanan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService & {
    produk: { findUnique: jest.Mock };
    pesanan: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PesananService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PesananService>(PesananService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create pesanan with total harga and order items', async () => {
      const dto = {
        waiterId: 1,
        kokiId: 2,
        items: [
          { productId: 'p1', quantity: 2 },
          { productId: 'p2', quantity: 1 },
        ],
      } as any;
      const produkP1 = { id: 'p1', harga: 10000 } as any;
      const produkP2 = { id: 'p2', harga: 15000 } as any;
      const created = { id: 'order-1', totalHarga: 35000 } as any;

      prismaMock.produk.findUnique
        .mockResolvedValueOnce(produkP1)
        .mockResolvedValueOnce(produkP2);
      prismaMock.pesanan.create.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);

      expect(prismaMock.produk.findUnique).toHaveBeenCalledTimes(2);
      const payload = prismaMock.pesanan.create.mock.calls[0][0];
      expect(payload.data.totalHarga).toEqual(35000);
      expect(payload.data.OrderItem.create).toEqual([
        { productId: 'p1', quantity: 2, hargaSatuan: produkP1.harga },
        { productId: 'p2', quantity: 1, hargaSatuan: produkP2.harga },
      ]);
    });

    it('should throw InternalServerErrorException when product not found', async () => {
      const dto = { waiterId: 1, kokiId: 2, items: [{ productId: 'missing', quantity: 1 }] } as any;
      prismaMock.produk.findUnique.mockResolvedValue(null);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      await expect(service.create(dto)).rejects.toBeInstanceOf(InternalServerErrorException);

      consoleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return all pesanan with relations', async () => {
      const list = [{ id: 'order-1' }] as any;
      prismaMock.pesanan.findMany.mockResolvedValue(list);

      await expect(service.findAll()).resolves.toEqual(list);
      expect(prismaMock.pesanan.findMany).toHaveBeenCalledWith({
        include: {
          OrderItem: {
            include: {
              product: true,
            },
          },
          waiter: true,
          koki: true,
          Pembayaran: true,
        },
      });
    });

    it('should throw InternalServerErrorException on prisma failure', async () => {
      prismaMock.pesanan.findMany.mockRejectedValue(new Error('fail'));

      await expect(service.findAll()).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return pesanan by id', async () => {
      const entity = { id: 'order-1' } as any;
      prismaMock.pesanan.findUnique.mockResolvedValue(entity);

      await expect(service.findOne('order-1')).resolves.toEqual(entity);
      expect(prismaMock.pesanan.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        include: {
          OrderItem: {
            include: {
              product: true,
            },
          },
          waiter: true,
          koki: true,
          Pembayaran: true,
        },
      });
    });

    it('should throw InternalServerErrorException on prisma failure', async () => {
      prismaMock.pesanan.findUnique.mockRejectedValue(new Error('fail'));

      await expect(service.findOne('order-1')).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update pesanan fields', async () => {
      const dto = { kokiId: 5, status: 'SELESAI' } as any;
      const updated = { id: 'order-1', ...dto } as any;
      prismaMock.pesanan.update.mockResolvedValue(updated);

      await expect(service.update('order-1', dto)).resolves.toEqual(updated);
      expect(prismaMock.pesanan.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: dto,
      });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prismaMock.pesanan.update.mockRejectedValue(new Error('fail'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      await expect(service.update('order-1', {} as any)).rejects.toBeInstanceOf(InternalServerErrorException);

      consoleSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should delete pesanan', async () => {
      const removed = { id: 'order-1' } as any;
      prismaMock.pesanan.delete.mockResolvedValue(removed);

      await expect(service.remove('order-1')).resolves.toEqual(removed);
      expect(prismaMock.pesanan.delete).toHaveBeenCalledWith({ where: { id: 'order-1' } });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prismaMock.pesanan.delete.mockRejectedValue(new Error('fail'));

      await expect(service.remove('order-1')).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
});

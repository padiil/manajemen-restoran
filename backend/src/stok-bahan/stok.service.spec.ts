import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { StokService } from './stok.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StokService', () => {
  let service: StokService;

  const prismaMock = {
    stokBahan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService & {
    stokBahan: {
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
        StokService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<StokService>(StokService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create stok bahan', async () => {
    const dto = { namaBahan: 'Tepung' } as any;
    const created = { id: 1 } as any;
    prismaMock.stokBahan.create.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
    expect(prismaMock.stokBahan.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should handle create failure', async () => {
    prismaMock.stokBahan.create.mockRejectedValue(new Error('fail'));

    await expect(service.create({} as any)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should return list of stok', async () => {
    const list = [{ id: 1 }] as any;
    prismaMock.stokBahan.findMany.mockResolvedValue(list);

    await expect(service.findAll()).resolves.toEqual(list);
  });

  it('should handle findAll failure', async () => {
    prismaMock.stokBahan.findMany.mockRejectedValue(new Error('fail'));

    await expect(service.findAll()).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should return stok by id', async () => {
    const entity = { id: 1 } as any;
    prismaMock.stokBahan.findUnique.mockResolvedValue(entity);

    await expect(service.findOne(1)).resolves.toEqual(entity);
    expect(prismaMock.stokBahan.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should handle findOne failure', async () => {
    prismaMock.stokBahan.findUnique.mockRejectedValue(new Error('fail'));

    await expect(service.findOne(1)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should update stok', async () => {
    const dto = { jumlah: 10 } as any;
    const updated = { id: 1, jumlah: 10 } as any;
    prismaMock.stokBahan.update.mockResolvedValue(updated);

    await expect(service.update(1, dto)).resolves.toEqual(updated);
    expect(prismaMock.stokBahan.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
  });

  it('should handle update failure', async () => {
    prismaMock.stokBahan.update.mockRejectedValue(new Error('fail'));

    await expect(service.update(1, {} as any)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should delete stok', async () => {
    const removed = { id: 1 } as any;
    prismaMock.stokBahan.delete.mockResolvedValue(removed);

    await expect(service.remove(1)).resolves.toEqual(removed);
    expect(prismaMock.stokBahan.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should handle delete failure', async () => {
    prismaMock.stokBahan.delete.mockRejectedValue(new Error('fail'));

    await expect(service.remove(1)).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});

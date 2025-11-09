import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ResepService } from './resep.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ResepService', () => {
  let service: ResepService;

  const prismaMock = {
    $transaction: jest.fn(),
    resep: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService & {
    $transaction: jest.Mock;
    resep: {
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
        ResepService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ResepService>(ResepService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBulk', () => {
    it('should run prisma transaction for bulk creation', async () => {
      const resepArray = [{ idProduk: 'p1' }, { idProduk: 'p2' }] as any;
      const created = [{ id: 'r1' }, { id: 'r2' }] as any;

      prismaMock.resep.create
        .mockResolvedValueOnce(created[0])
        .mockResolvedValueOnce(created[1]);
      prismaMock.$transaction.mockResolvedValue(created);

      await expect(service.createBulk(resepArray)).resolves.toEqual(created);
      expect(prismaMock.resep.create).toHaveBeenCalledTimes(2);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when transaction fails', async () => {
      prismaMock.$transaction.mockRejectedValue(new Error('fail'));

      await expect(service.createBulk([] as any)).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  it('should create resep', async () => {
    const dto = { idProduk: 'p1' } as any;
    const created = { id: 'r1' } as any;
    prismaMock.resep.create.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
    expect(prismaMock.resep.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should handle create failure', async () => {
    prismaMock.resep.create.mockRejectedValue(new Error('fail'));

    await expect(service.create({} as any)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should find all resep with relations', async () => {
    const list = [{ id: 'r1' }] as any;
    prismaMock.resep.findMany.mockResolvedValue(list);

    await expect(service.findAll()).resolves.toEqual(list);
    expect(prismaMock.resep.findMany).toHaveBeenCalledWith({
      include: {
        produk: true,
        bahan: true,
      },
    });
  });

  it('should handle findAll failure', async () => {
    prismaMock.resep.findMany.mockRejectedValue(new Error('fail'));

    await expect(service.findAll()).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should find resep by id with relations', async () => {
    const entity = { id: 'r1' } as any;
    prismaMock.resep.findUnique.mockResolvedValue(entity);

    await expect(service.findOne('r1')).resolves.toEqual(entity);
    expect(prismaMock.resep.findUnique).toHaveBeenCalledWith({
      where: { id: 'r1' },
      include: {
        produk: true,
        bahan: true,
      },
    });
  });

  it('should handle findOne failure', async () => {
    prismaMock.resep.findUnique.mockRejectedValue(new Error('fail'));

    await expect(service.findOne('r1')).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should update resep', async () => {
    const dto = { kuantitas: 2 } as any;
    const updated = { id: 'r1', kuantitas: 2 } as any;
    prismaMock.resep.update.mockResolvedValue(updated);

    await expect(service.update('r1', dto)).resolves.toEqual(updated);
    expect(prismaMock.resep.update).toHaveBeenCalledWith({ where: { id: 'r1' }, data: dto });
  });

  it('should handle update failure', async () => {
    prismaMock.resep.update.mockRejectedValue(new Error('fail'));

    await expect(service.update('r1', {} as any)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should delete resep', async () => {
    const removed = { id: 'r1' } as any;
    prismaMock.resep.delete.mockResolvedValue(removed);

    await expect(service.remove('r1')).resolves.toEqual(removed);
    expect(prismaMock.resep.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
  });

  it('should handle delete failure', async () => {
    prismaMock.resep.delete.mockRejectedValue(new Error('fail'));

    await expect(service.remove('r1')).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should find resep by produk id', async () => {
    const list = [{ id: 'r1' }] as any;
    prismaMock.resep.findMany.mockResolvedValue(list);

    await expect(service.findByProdukId('p1')).resolves.toEqual(list);
    expect(prismaMock.resep.findMany).toHaveBeenCalledWith({
      where: { idProduk: 'p1' },
      include: {
        bahan: true,
      },
    });
  });

  it('should find resep by bahan id', async () => {
    const list = [{ id: 'r1' }] as any;
    prismaMock.resep.findMany.mockResolvedValue(list);

    await expect(service.findByBahanId(10)).resolves.toEqual(list);
    expect(prismaMock.resep.findMany).toHaveBeenCalledWith({
      where: { idBahan: 10 },
      include: {
        produk: true,
      },
    });
  });

  it('should handle findBy methods failure', async () => {
    prismaMock.resep.findMany.mockRejectedValue(new Error('fail'));

    await expect(service.findByProdukId('p1')).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});

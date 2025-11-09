import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { MenuService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MenuService', () => {
  let service: MenuService;

  const prismaMock = {
    produk: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService & {
    produk: {
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
        MenuService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create menu item', async () => {
    const dto = { nama: 'Nasi Goreng' } as any;
    const created = { id: 'm1', ...dto } as any;
    prismaMock.produk.create.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual(created);
    expect(prismaMock.produk.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should throw InternalServerErrorException when create fails', async () => {
    prismaMock.produk.create.mockRejectedValue(new Error('fail'));

    await expect(service.create({} as any)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should return all menu items', async () => {
    const list = [{ id: 'm1' }] as any;
    prismaMock.produk.findMany.mockResolvedValue(list);

    await expect(service.findAll()).resolves.toEqual(list);
  });

  it('should handle findAll failure', async () => {
    prismaMock.produk.findMany.mockRejectedValue(new Error('fail'));

    await expect(service.findAll()).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should return menu by id', async () => {
    const entity = { id: 'm1' } as any;
    prismaMock.produk.findUnique.mockResolvedValue(entity);

    await expect(service.findOne('m1')).resolves.toEqual(entity);
    expect(prismaMock.produk.findUnique).toHaveBeenCalledWith({ where: { id: 'm1' } });
  });

  it('should handle findOne failure', async () => {
    prismaMock.produk.findUnique.mockRejectedValue(new Error('fail'));

    await expect(service.findOne('m1')).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should update menu item', async () => {
    const dto = { harga: 12000 } as any;
    const updated = { id: 'm1', harga: 12000 } as any;
    prismaMock.produk.update.mockResolvedValue(updated);

    await expect(service.update('m1', dto)).resolves.toEqual(updated);
    expect(prismaMock.produk.update).toHaveBeenCalledWith({ where: { id: 'm1' }, data: dto });
  });

  it('should handle update failure', async () => {
    prismaMock.produk.update.mockRejectedValue(new Error('fail'));

    await expect(service.update('m1', {} as any)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('should delete menu item', async () => {
    const removed = { id: 'm1' } as any;
    prismaMock.produk.delete.mockResolvedValue(removed);

    await expect(service.remove('m1')).resolves.toEqual(removed);
    expect(prismaMock.produk.delete).toHaveBeenCalledWith({ where: { id: 'm1' } });
  });

  it('should handle delete failure', async () => {
    prismaMock.produk.delete.mockRejectedValue(new Error('fail'));

    await expect(service.remove('m1')).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});

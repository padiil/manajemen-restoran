import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('KaryawanService', () => {
  let service: KaryawanService;
  const prismaMock = {
    karyawan: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService & {
    karyawan: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KaryawanService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<KaryawanService>(KaryawanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash password and create karyawan', async () => {
      const dto = { nama: 'John', jabatan: 'KOKI', email: 'john@test.com', password: 'secret' };
      const hashed = 'hashed-secret';
      const created = { id: 1, ...dto, password: hashed } as any;

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);
      prismaMock.karyawan.create = jest.fn().mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);
      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 'salt');
      expect(prismaMock.karyawan.create).toHaveBeenCalledWith({
        data: {
          nama: dto.nama,
          jabatan: dto.jabatan,
          email: dto.email,
          password: hashed,
        },
      });
    });

    it('should wrap prisma errors in InternalServerErrorException', async () => {
      const dto = { nama: 'John', jabatan: 'KOKI', email: 'john@test.com', password: 'secret' };
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      prismaMock.karyawan.create = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(service.create(dto)).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findByEmail', () => {
    it('should return karyawan by email', async () => {
      const entity = { id: 1, email: 'john@test.com' } as any;
      prismaMock.karyawan.findUnique = jest.fn().mockResolvedValue(entity);

      await expect(service.findByEmail(entity.email)).resolves.toEqual(entity);
      expect(prismaMock.karyawan.findUnique).toHaveBeenCalledWith({ where: { email: entity.email } });
    });

    it('should throw InternalServerErrorException on prisma failure', async () => {
      prismaMock.karyawan.findUnique = jest.fn().mockRejectedValue(new Error('oops'));

      await expect(service.findByEmail('test@test.com')).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return list of karyawan', async () => {
      const list = [{ id: 1 }] as any;
      prismaMock.karyawan.findMany = jest.fn().mockResolvedValue(list);

      await expect(service.findAll()).resolves.toEqual(list);
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prismaMock.karyawan.findMany = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(service.findAll()).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return karyawan by id', async () => {
      const entity = { id: 1 } as any;
      prismaMock.karyawan.findUnique = jest.fn().mockResolvedValue(entity);

      await expect(service.findOne(1)).resolves.toEqual(entity);
      expect(prismaMock.karyawan.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prismaMock.karyawan.findUnique = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(service.findOne(1)).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should hash password when provided and update karyawan', async () => {
      const dto = { password: 'new-secret', nama: 'Updated' } as any;
      const hashed = 'hashed-new';
      const updated = { id: 1, ...dto, password: hashed } as any;
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);
      prismaMock.karyawan.update = jest.fn().mockResolvedValue(updated);

      await expect(service.update(1, dto)).resolves.toEqual(updated);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 'salt');
      expect(prismaMock.karyawan.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...dto, password: hashed },
      });
    });

    it('should update without hashing when password not provided', async () => {
      const dto = { nama: 'Updated' } as any;
      const updated = { id: 1, nama: 'Updated' } as any;
      prismaMock.karyawan.update = jest.fn().mockResolvedValue(updated);

      await expect(service.update(1, dto)).resolves.toEqual(updated);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prismaMock.karyawan.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prismaMock.karyawan.update = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(service.update(1, {})).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should delete karyawan', async () => {
      const removed = { id: 1 } as any;
      prismaMock.karyawan.delete = jest.fn().mockResolvedValue(removed);

      await expect(service.remove(1)).resolves.toEqual(removed);
      expect(prismaMock.karyawan.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      prismaMock.karyawan.delete = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(service.remove(1)).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
});

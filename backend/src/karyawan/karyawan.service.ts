import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Jabatan } from '@prisma/client';

@Injectable()
export class KaryawanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    nama: string;
    jabatan: string;
    email: string;
    password: string;
  }) {
    return await this.prisma.karyawan.create({
      data: {
        ...data,
        jabatan: data.jabatan as Jabatan,
      },
    });
  }

  async findAll() {
    return await this.prisma.karyawan.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.karyawan.findUnique({ where: { id } });
  }

  async update(id: number, data: { nama?: string; jabatan?: Jabatan }) {
    return await this.prisma.karyawan.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.karyawan.delete({ where: { id } });
  }
}

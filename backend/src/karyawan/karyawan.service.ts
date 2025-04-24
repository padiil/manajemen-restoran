import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Jabatan } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class KaryawanService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: {
    nama: string;
    jabatan: string;
    email: string;
    password: string;
  }) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);

      return await this.prisma.karyawan.create({
        data: {
          nama: data.nama,
          jabatan: data.jabatan as Jabatan,
          email: data.email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to create karyawan');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.karyawan.findUnique({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve karyawan by email');
    }
  }

  async findAll() {
    try {
      return await this.prisma.karyawan.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve karyawan list');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.karyawan.findUnique({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve karyawan');
    }
  }

  async update(id: number, data: {
    nama?: string;
    jabatan?: Jabatan;
    email?: string;
    password?: string;
    aktif?: boolean;
    clockedOutAt?: Date;
  }) {
    try {
      const updateData: any = { ...data };

      if (data.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(data.password, salt);
      }

      return await this.prisma.karyawan.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update karyawan');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.karyawan.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete karyawan');
    }
  }
}

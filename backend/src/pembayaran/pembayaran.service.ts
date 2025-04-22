import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';

@Injectable()
export class PembayaranService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPembayaranDto: CreatePembayaranDto) {
    try {
      const { idPesanan, metode, jumlah } = createPembayaranDto;
      return await this.prisma.pembayaran.create({
        data: {
          metode,
          jumlah,
          pesanan: {
            connect: { id: idPesanan },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create pembayaran');
    }
  }

  async findAll() {
    try {
      return await this.prisma.pembayaran.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve daftar pembayaran');
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.pembayaran.findUnique({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to retrieve pembayaran dengan ID ${id}`);
    }
  }

  async findByPesananId(pesananId: string) {
    try {
      return await this.prisma.pembayaran.findUnique({ where: { orderId: pesananId } });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to retrieve pembayaran untuk pesanan ID ${pesananId}`);
    }
  }
}
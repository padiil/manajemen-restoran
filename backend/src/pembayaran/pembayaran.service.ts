import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';

@Injectable()
export class PembayaranService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPembayaranDto: CreatePembayaranDto) {
    try {
      const { idPesanan, metode, jumlah } = createPembayaranDto;

      // Ambil pesanan berdasarkan idPesanan
      const pesanan = await this.prisma.pesanan.findUnique({
        where: { id: idPesanan },
      });

      if (!pesanan) {
        throw new BadRequestException('Pesanan tidak ditemukan');
      }

      // Validasi jumlah pembayaran
      if (jumlah < pesanan.totalHarga) {
        throw new BadRequestException(
          'Jumlah pembayaran tidak mencukupi total harga pesanan'
        );
      }

      // Hitung kembalian jika ada
      const kembalian = jumlah > pesanan.totalHarga ? jumlah - pesanan.totalHarga : 0;

      // Buat pembayaran
      const pembayaran = await this.prisma.pembayaran.create({
        data: {
          metode,
          jumlah,
          kembalian,
          pesanan: {
            connect: { id: idPesanan },
          },
        },
      });

      // Ubah status pesanan menjadi DIBAYAR
      await this.prisma.pesanan.update({
        where: { id: idPesanan },
        data: { status: 'DIBAYAR' },
      });

      console.log('Pembayaran berhasil dibuat:', pembayaran);
      return pembayaran;
    } catch (error) {
      console.error('Error creating pembayaran:', error);
      throw error;
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

  async remove(id: string) {
    try {
      return await this.prisma.pembayaran.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete pembayaran dengan ID ${id}`);
    }
  }
}
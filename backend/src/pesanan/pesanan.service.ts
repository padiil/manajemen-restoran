import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePesananDto } from './dto/create-pesanan.dto';
import { UpdatePesananDto } from './dto/update-pesanan.dto';

@Injectable()
export class PesananService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPesananDto: CreatePesananDto) {
        try {
            const orderItemsData = await Promise.all(
                createPesananDto.items.map(async (item) => {
                    const product = await this.prisma.produk.findUnique({
                        where: { id: item.productId },
                    });
                    if (!product) {
                        throw new InternalServerErrorException(`Product with ID ${item.productId} not found`);
                    }
                    return {
                        productId: item.productId,
                        quantity: item.quantity,
                        hargaSatuan: product.harga,
                    };
                }),
            );

            // Hitung total harga berdasarkan order items
            const totalHarga = orderItemsData.reduce((sum, item) => {
                return sum + item.quantity * item.hargaSatuan;
            }, 0);

            const pesanan = await this.prisma.pesanan.create({
                data: {
                    waiterId: createPesananDto.waiterId,
                    kokiId: createPesananDto.kokiId,
                    totalHarga, // Simpan total harga ke dalam pesanan
                    OrderItem: {
                        create: orderItemsData.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            hargaSatuan: item.hargaSatuan,
                        })),
                    },
                },
                include: {
                    OrderItem: true,
                },
            });
            return pesanan;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to create pesanan');
        }
    }

    async findAll() {
        try {
            return await this.prisma.pesanan.findMany({
                include: {
                    OrderItem: {
                        include: {
                            product: true, // Include detail produk dalam item pesanan
                        },
                    },
                    waiter: true, // Include informasi waiter
                    koki: true,   // Include informasi koki
                    Pembayaran: true, // Include informasi pembayaran jika ada
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve daftar pesanan');
        }
    }

    async findOne(id: string) {
        try {
            return await this.prisma.pesanan.findUnique({
                where: { id },
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
        } catch (error) {
            throw new InternalServerErrorException(`Failed to retrieve pesanan dengan ID ${id}`);
        }
    }

    async update(id: string, updatePesananDto: UpdatePesananDto) {
        try {
            // Konversi properti undefined menjadi null untuk kokiId
            const data: { kokiId?: number; status?: string } = {};
            if (updatePesananDto.kokiId !== undefined) {
                data.kokiId = updatePesananDto.kokiId;
            }
            if (updatePesananDto.status !== undefined) {
                data.status = updatePesananDto.status as any; // Cast ke StatusPesanan
            }

            return await this.prisma.pesanan.update({
                where: { id },
                data: data as any, // Cast to 'any' to bypass strict type checking
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(`Failed to update pesanan dengan ID ${id}`);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.pesanan.delete({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to delete pesanan dengan ID ${id}`);
        }
    }
}
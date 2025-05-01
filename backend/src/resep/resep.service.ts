import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResepDto } from './dto/create-resep.dto';
import { UpdateResepDto } from './dto/update-resep.dto';

@Injectable()
export class ResepService {
    constructor(private readonly prisma: PrismaService) { }

    async createBulk(resepArray: CreateResepDto[]) {
        try {
            return await this.prisma.$transaction(
                resepArray.map((resep) =>
                    this.prisma.resep.create({
                        data: resep,
                    }),
                ),
            );
        } catch (error) {
            throw new InternalServerErrorException('Failed to create bulk resep');
        }
    }

    async create(createResepDto: CreateResepDto) {
        try {
            return await this.prisma.resep.create({
                data: createResepDto,
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to create resep');
        }
    }

    async findAll() {
        try {
            return await this.prisma.resep.findMany({
                include: {
                    produk: true, // Include detail produk
                    bahan: true,  // Include detail bahan
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve daftar resep');
        }
    }

    async findOne(id: string) {
        try {
            return await this.prisma.resep.findUnique({
                where: { id },
                include: {
                    produk: true,
                    bahan: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to retrieve resep dengan ID ${id}`);
        }
    }

    async update(id: string, updateResepDto: UpdateResepDto) {
        try {
            return await this.prisma.resep.update({
                where: { id },
                data: updateResepDto,
            });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to update resep dengan ID ${id}`);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.resep.delete({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to delete resep dengan ID ${id}`);
        }
    }

    async findByProdukId(produkId: string) {
        try {
            return await this.prisma.resep.findMany({
                where: { idProduk: produkId },
                include: {
                    bahan: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to retrieve resep untuk produk ID ${produkId}`);
        }
    }

    async findByBahanId(bahanId: number) {
        try {
            return await this.prisma.resep.findMany({
                where: { idBahan: bahanId },
                include: {
                    produk: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to retrieve resep yang menggunakan bahan ID ${bahanId}`);
        }
    }
}
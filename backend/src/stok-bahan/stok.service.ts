import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStokDto } from './dto/create-stok.dto';
import { UpdateStokDto } from './dto/update-stok.dto';

@Injectable()
export class StokService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createStokDto: CreateStokDto) {
        try {
            return await this.prisma.stokBahan.create({
                data: createStokDto,
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to create stok bahan');
        }
    }

    async findAll() {
        try {
            return await this.prisma.stokBahan.findMany();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve daftar stok bahan');
        }
    }

    async findOne(id: number) {
        try {
            return await this.prisma.stokBahan.findUnique({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to retrieve stok bahan dengan ID ${id}`);
        }
    }

    async update(id: number, updateStokDto: UpdateStokDto) {
        try {
            return await this.prisma.stokBahan.update({
                where: { id },
                data: updateStokDto,
            });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to update stok bahan dengan ID ${id}`);
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.stokBahan.delete({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to delete stok bahan dengan ID ${id}`);
        }
    }
}
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createMenuDto: CreateMenuDto) {
        try {
            return await this.prisma.produk.create({
                data: createMenuDto,
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to create menu item');
        }
    }

    async findAll() {
        try {
            return await this.prisma.produk.findMany();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve menu list');
        }
    }

    async findOne(id: string) {
        try {
            return await this.prisma.produk.findUnique({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to retrieve menu item with ID ${id}`);
        }
    }

    async update(id: string, updateMenuDto: UpdateMenuDto) {
        try {
            return await this.prisma.produk.update({
                where: { id },
                data: updateMenuDto,
            });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to update menu item with ID ${id}`);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.produk.delete({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to delete menu item with ID ${id}`);
        }
    }
}
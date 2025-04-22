import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { ResepService } from './resep.service';
import { CreateResepDto } from './dto/create-resep.dto';
import { UpdateResepDto } from './dto/update-resep.dto';

@Controller('resep')
export class ResepController {
    constructor(private readonly resepService: ResepService) { }

    @Post()
    async create(@Body() createResepDto: CreateResepDto) {
        return this.resepService.create(createResepDto);
    }

    @Get()
    async findAll() {
        return this.resepService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.resepService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateResepDto: UpdateResepDto,
    ) {
        return this.resepService.update(id, updateResepDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.resepService.remove(id);
    }

    @Get('/produk/:produkId')
    async findByProdukId(@Param('produkId') produkId: string) {
        return this.resepService.findByProdukId(produkId);
    }

    @Get('/bahan/:bahanId')
    async findByBahanId(@Param('bahanId') bahanId: string) {
        return this.resepService.findByBahanId(Number(bahanId));
    }
}
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { CreatePesananDto } from './dto/create-pesanan.dto';
import { UpdatePesananDto } from './dto/update-pesanan.dto';

@Controller('pesanan')
export class PesananController {
    constructor(private readonly pesananService: PesananService) { }

    @Post()
    async create(@Body() createPesananDto: CreatePesananDto) {
        return this.pesananService.create(createPesananDto);
    }

    @Get()
    async findAll() {
        return this.pesananService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.pesananService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePesananDto: UpdatePesananDto,
    ) {
        return this.pesananService.update(id, updatePesananDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.pesananService.remove(id);
    }
}
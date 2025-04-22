import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { StokService } from './stok.service';
import { CreateStokDto } from './dto/create-stok.dto';
import { UpdateStokDto } from './dto/update-stok.dto';

@Controller('stok-bahan')
export class StokController {
    constructor(private readonly stokService: StokService) { }

    @Post()
    async create(@Body() createStokDto: CreateStokDto) {
        return this.stokService.create(createStokDto);
    }

    @Get()
    async findAll() {
        return this.stokService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.stokService.findOne(Number(id));
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateStokDto: UpdateStokDto,
    ) {
        return this.stokService.update(Number(id), updateStokDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.stokService.remove(Number(id));
    }
}
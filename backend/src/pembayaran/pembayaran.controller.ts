import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
} from '@nestjs/common';
import { PembayaranService } from './pembayaran.service';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';

@Controller('pembayaran')
export class PembayaranController {
    constructor(private readonly pembayaranService: PembayaranService) { }

    @Post()
    async create(@Body() createPembayaranDto: CreatePembayaranDto) {
        return this.pembayaranService.create(createPembayaranDto);
    }

    @Get()
    async findAll() {
        return this.pembayaranService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.pembayaranService.findOne(id);
    }

    @Get('/pesanan/:pesananId')
    async findByPesananId(@Param('pesananId') pesananId: string) {
        return this.pembayaranService.findByPesananId(pesananId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.pembayaranService.remove(id);
    }
}
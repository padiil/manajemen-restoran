import { Module } from '@nestjs/common';
import { PembayaranController } from './pembayaran.controller';
import { PembayaranService } from './pembayaran.service';

@Module({
  controllers: [PembayaranController],
  providers: [PembayaranService]
})
export class PembayaranModule {}

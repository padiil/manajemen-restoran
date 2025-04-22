import { Module } from '@nestjs/common';
import { PesananController } from './pesanan.controller';
import { PesananService } from './pesanan.service';

@Module({
  controllers: [PesananController],
  providers: [PesananService]
})
export class PesananModule {}

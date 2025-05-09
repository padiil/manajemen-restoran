import { Module } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { KaryawanController } from './karyawan.controller';

@Module({
  providers: [KaryawanService],
  controllers: [KaryawanController],
  exports: [KaryawanService],
})
export class KaryawanModule {}

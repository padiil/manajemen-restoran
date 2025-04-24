import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KaryawanModule } from './karyawan/karyawan.module';
import { PesananModule } from './pesanan/pesanan.module';
import { StokModule } from './stok-bahan/stok.module';
import { PembayaranModule } from './pembayaran/pembayaran.module';
import { LaporanModule } from './laporan/laporan.module';
import { ResepModule } from './resep/resep.module';
import { MenuModule } from './menu/menu.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [KaryawanModule, PrismaModule, PesananModule, StokModule, PembayaranModule, LaporanModule, ResepModule, MenuModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

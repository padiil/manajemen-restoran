import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetLaporanDto } from './dto/laporan.dto';

@Injectable()
export class LaporanService {
    constructor(private readonly prisma: PrismaService) { }

    async generateLaporan(query: GetLaporanDto) {
        const { jenis, tanggal, periodeMulai, periodeSelesai } = query;

        try {
            switch (jenis) {
                case 'harian':
                    return await this.getLaporanHarian(tanggal ?? '');
                case 'mingguan':
                    return await this.getLaporanMingguan(periodeMulai ?? '', periodeSelesai ?? '');
                case 'bulanan':
                    return await this.getLaporanBulanan(tanggal ?? '');
                case 'tahunan':
                    return await this.getLaporanTahunan(tanggal ?? '');
                default:
                    return { message: 'Jenis laporan tidak valid' };
            }
        } catch (error) {
            console.error('Error generating laporan:', error);
            throw new InternalServerErrorException('Gagal membuat laporan');
        }
    }

    async getLaporanHarian(tanggal: string) {
        const startOfDay = new Date(tanggal);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(tanggal);
        endOfDay.setHours(23, 59, 59, 999);

        return {
            tanggal,
            keuangan: await this.getLaporanKeuangan(startOfDay, endOfDay),
            stok: await this.getLaporanStok(startOfDay, endOfDay),
            pesanan: await this.getLaporanPesanan(startOfDay, endOfDay),
        };
    }

    async getLaporanMingguan(periodeMulai: string, periodeSelesai: string) {
        const startDate = new Date(periodeMulai);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(periodeSelesai);
        endDate.setHours(23, 59, 59, 999);

        return {
            periodeMulai,
            periodeSelesai,
            keuangan: await this.getLaporanKeuangan(startDate, endDate),
            stok: await this.getLaporanStok(startDate, endDate),
            pesanan: await this.getLaporanPesanan(startDate, endDate),
        };
    }

    async getLaporanBulanan(tanggal: string) {
        const [year, month] = tanggal.split('-').map(Number);
        const startOfMonth = new Date(year, month - 1, 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(year, month, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        return {
            bulan: tanggal,
            keuangan: await this.getLaporanKeuangan(startOfMonth, endOfMonth),
            stok: await this.getLaporanStok(startOfMonth, endOfMonth),
            pesanan: await this.getLaporanPesanan(startOfMonth, endOfMonth),
        };
    }

    async getLaporanTahunan(tanggal: string) {
        const year = Number(tanggal);
        const startOfYear = new Date(year, 0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        const endOfYear = new Date(year, 11, 31);
        endOfYear.setHours(23, 59, 59, 999);

        return {
            tahun: tanggal,
            keuangan: await this.getLaporanKeuangan(startOfYear, endOfYear),
            stok: await this.getLaporanStok(startOfYear, endOfYear),
            pesanan: await this.getLaporanPesanan(startOfYear, endOfYear),
        };
    }

    async getLaporanKeuangan(startDate: Date, endDate: Date) {
        const totalPendapatan = await this.prisma.pembayaran.aggregate({
            _sum: { jumlah: true },
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const totalPengeluaranData = await this.prisma.pengeluaran.aggregate({
            _sum: { jumlah: true },
            where: {
                tanggal: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalPengeluaran = totalPengeluaranData._sum?.jumlah || 0;

        const labaBersih = (totalPendapatan._sum?.jumlah || 0) - totalPengeluaran;

        return {
            totalPendapatan: totalPendapatan._sum?.jumlah || 0,
            totalPengeluaran,
            labaBersih,
        };
    }

    async getLaporanStok(startDate: Date, endDate: Date) {
        const stokAwalMap = new Map<number, { namaBahan: string; jumlah: number; satuan: string }>();
        const initialSnapshots = await this.prisma.snapshotStokBahan.findMany({
            where: { tanggal: { lte: startDate } },
            orderBy: { tanggal: 'desc' },
            distinct: ['idStok'],
            include: { stok: true },
        });
        initialSnapshots.forEach(s => {
            stokAwalMap.set(s.idStok, { namaBahan: s.stok.namaBahan, jumlah: s.jumlah, satuan: s.stok.satuan });
        });

        const stokAkhirMap = new Map<number, { namaBahan: string; jumlah: number; satuan: string }>();
        const finalSnapshots = await this.prisma.snapshotStokBahan.findMany({
            where: { tanggal: { lte: endDate } },
            orderBy: { tanggal: 'desc' },
            distinct: ['idStok'],
            include: { stok: true },
        });
        finalSnapshots.forEach(s => {
            stokAkhirMap.set(s.idStok, { namaBahan: s.stok.namaBahan, jumlah: s.jumlah, satuan: s.stok.satuan });
        });

        const perubahanStok: { namaBahan: string; perubahan: number; satuan: string }[] = [];
        for (const [idStok, awal] of stokAwalMap) {
            const akhir = stokAkhirMap.get(idStok);
            const perubahan = (akhir?.jumlah || 0) - awal.jumlah;
            perubahanStok.push({ namaBahan: awal.namaBahan, perubahan, satuan: awal.satuan });
        }

        // Lacak bahan paling banyak digunakan
        const produkTerlaris = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5, // Contoh: 5 produk terlaris
        });

        const penggunaanBahan: { [namaBahan: string]: number } = {};
        for (const produk of produkTerlaris) {
            const resepProduk = await this.prisma.resep.findMany({
                where: { idProduk: produk.productId },
                include: { bahan: true },
            });
            resepProduk.forEach(resep => {
                const totalPenggunaan = (produk._sum.quantity || 0) * resep.kuantitas;
                penggunaanBahan[resep.bahan.namaBahan] = (penggunaanBahan[resep.bahan.namaBahan] || 0) + totalPenggunaan;
            });
        }

        const bahanTerbanyakDigunakan = Object.entries(penggunaanBahan)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .reduce((obj, [key, val]) => {
                obj[key] = val;
                return obj;
            }, {});

        return {
            stokAwal: Array.from(stokAwalMap.values()),
            stokAkhir: Array.from(stokAkhirMap.values()),
            perubahanStok,
            bahanTerbanyakDigunakan,
        };
    }

    async getLaporanPesanan(startDate: Date, endDate: Date) {
        const jumlahPesanan = await this.prisma.pesanan.count({
            where: { createdAt: { gte: startDate, lte: endDate } },
        });

        const totalNilaiPesanan = await this.prisma.pesanan.aggregate({
            _sum: { totalHarga: true },
            where: { createdAt: { gte: startDate, lte: endDate } },
        });

        const rataRataNilaiPesanan = jumlahPesanan > 0 ? (totalNilaiPesanan._sum?.totalHarga || 0) / jumlahPesanan : 0;

        // Dapatkan ID produk terlaris
        const itemTerlarisIds = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5,
        }).then(items => items.map(item => item.productId));

        // Dapatkan detail produk untuk ID produk terlaris
        const itemTerlarisDetails = await this.prisma.produk.findMany({
            where: { id: { in: itemTerlarisIds } },
        });

        // Gabungkan ID dan detail produk terlaris
        const itemTerlaris = itemTerlarisIds.map(productId => {
            const detail = itemTerlarisDetails.find(p => p.id === productId);
            const terjual = itemTerlarisIds.reduce((count, id) => (id === productId ? count + 1 : count), 0); // Hitung total terjual (mungkin kurang efisien jika ada banyak duplikat ID)
            const totalTerjual = itemTerlaris.find(item => item.productId === productId)?._sum.quantity || 0; // Ambil total terjual dari hasil groupBy

            return {
                nama: detail?.nama || 'Produk tidak ditemukan',
                totalTerjual: totalTerjual,
            };
        });

        return {
            jumlahPesanan,
            totalNilaiPesanan: totalNilaiPesanan._sum?.totalHarga || 0,
            rataRataNilaiPesanan,
            itemTerlaris,
        };
    }
}
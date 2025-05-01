-- CreateEnum
CREATE TYPE "Jabatan" AS ENUM ('KEPALA_TOKO', 'KASIR', 'KOKI', 'WAITER');

-- CreateEnum
CREATE TYPE "StatusPesanan" AS ENUM ('DIBUAT', 'SELESAI', 'DIBAYAR');

-- CreateTable
CREATE TABLE "karyawan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" "Jabatan" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "clockedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clockedOutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "harga" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stok_bahan" (
    "id" SERIAL NOT NULL,
    "namaBahan" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stok_bahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengeluaran" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deskripsi" TEXT,
    "jumlah" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resep" (
    "id" TEXT NOT NULL,
    "idProduk" TEXT NOT NULL,
    "idBahan" INTEGER NOT NULL,
    "kuantitas" DOUBLE PRECISION NOT NULL,
    "satuanPakai" TEXT NOT NULL,

    CONSTRAINT "resep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshot_stok_bahan" (
    "id" SERIAL NOT NULL,
    "idStok" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "snapshot_stok_bahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesanan" (
    "id" TEXT NOT NULL,
    "waiterId" INTEGER NOT NULL,
    "kokiId" INTEGER,
    "totalHarga" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "StatusPesanan" NOT NULL DEFAULT 'DIBUAT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "hargaSatuan" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayaran" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "metode" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "kembalian" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_keuangan" (
    "id" TEXT NOT NULL,
    "totalPendapatan" DOUBLE PRECISION NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laporan_keuangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_transaksi" (
    "id" TEXT NOT NULL,
    "totalTransaksi" INTEGER NOT NULL,
    "totalPendapatan" DOUBLE PRECISION NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laporan_transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_email_key" ON "karyawan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "stok_bahan_namaBahan_key" ON "stok_bahan"("namaBahan");

-- CreateIndex
CREATE UNIQUE INDEX "resep_idProduk_idBahan_key" ON "resep"("idProduk", "idBahan");

-- CreateIndex
CREATE UNIQUE INDEX "pembayaran_orderId_key" ON "pembayaran"("orderId");

-- AddForeignKey
ALTER TABLE "resep" ADD CONSTRAINT "resep_idProduk_fkey" FOREIGN KEY ("idProduk") REFERENCES "produk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resep" ADD CONSTRAINT "resep_idBahan_fkey" FOREIGN KEY ("idBahan") REFERENCES "stok_bahan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshot_stok_bahan" ADD CONSTRAINT "snapshot_stok_bahan_idStok_fkey" FOREIGN KEY ("idStok") REFERENCES "stok_bahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_kokiId_fkey" FOREIGN KEY ("kokiId") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "pesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "pesanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

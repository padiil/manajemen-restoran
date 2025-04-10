# 🧾 Manajemen Restoran - Fullstack ERP

Sistem ERP ini dibuat untuk membantu pengelolaan operasional restoran secara menyeluruh, mencakup pemesanan, pembayaran, manajemen stok, hingga pelaporan keuangan.

## 🛠️ Teknologi yang Digunakan

- **Backend**: [NestJS](https://nestjs.com/)  
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)  
- **Database**: PostgreSQL NeonDb 
- **ORM**: Prisma  
- **Diagram**: Mermaid.js  
- **Manual Monorepo**

## 📁 Struktur Direktori

```
manajemen-restoran/
├── backend/       # Source code NestJS (API)
├── frontend/      # Source code React + Vite (UI)
├── .gitignore
└── README.md
```

## 🚀 Cara Menjalankan Proyek

### 📦 1. Clone Repositori

```bash
git clone https://github.com/username/manajemen-restoran.git
cd manajemen-restoran
```

### 📁 2. Setup Backend

```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

### 🌐 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

## 🧠 Fitur Utama

- Pencatatan & manajemen pesanan  
- Pengelolaan stok bahan  
- Proses pembayaran & pelaporan  
- Role pengguna: Kepala Toko, Kasir, Koki, Waiter  
- Otentikasi pengguna  

---

## 📐 Desain Sistem

### **Use Case Diagram**
```mermaid
---
config:
  theme: default
  layout: elk
---
flowchart TD
    KepalaToko["🏢 Kepala Toko"] -- Mengelola Karyawan --> Karyawan["👤 Karyawan"]
    KepalaToko -- Mengelola Stok Bahan --> StokBahan["📦 Stok Bahan"]
    KepalaToko -- Melihat Laporan Keuangan --> LaporanKeuangan["📊 Laporan Keuangan"]
    KepalaToko -- Melihat Laporan Transaksi --> LaporanTransaksi["📈 Laporan Transaksi"]

    Waiter["🍽️ Waiter"] -- Mencatat Pesanan --> Pesanan["📝 Pesanan"]
    Waiter -- Mengantarkan Pesanan --> Pelanggan["👥 Pelanggan"]

    Kasir["💰 Kasir"] -- Mengelola Pembayaran --> Pembayaran["💳 Pembayaran"]
    Kasir -- Melihat Laporan Transaksi --> LaporanTransaksi

    Koki["👨‍🍳 Koki"] -- Melihat Daftar Pesanan --> Pesanan
    Koki -- Update Status Pesanan --> Pesanan
    
    KepalaToko:::actor
    Waiter:::actor
    Kasir:::actor
    Koki:::actor

    classDef actor fill:#f4f4f4,stroke:#000,stroke-width:2px
    classDef entity fill:#fff,stroke:#ff0000,stroke-width:2px

```

### **Class Diagram**
```mermaid
---
config:
  theme: default
---
classDiagram
    class User {
        +id: UUID
        +nama: string
        +email: string
        +password: string
        +login()
    }
    class KepalaToko {
        +kelolaStok()
        +lihatLaporanKeuangan()
        +lihatLaporanTransaksi()
        +kelolaKaryawan()
    }
    class Kasir {
        +kelolaPembayaran()
        +lihatLaporanTransaksi()
    }
    class Waiter {
        +catatPesanan()
        +antarPesanan()
    }
    class Koki {
        +lihatPesanan()
        +updateStatusPesanan()
    }
    class Pesanan {
        +id: UUID
        +idWaiter: UUID
        +idKoki: UUID
        +status: string
        +totalHarga: float
        +updateStatus(newStatus)
    }
    class Pembayaran {
        +id: UUID
        +idPesanan: UUID
        +metode: string
        +jumlah: float
        +konfirmasiPembayaran()
    }
    class LaporanKeuangan {
        +id: UUID
        +totalPendapatan: float
        +tanggal: date
        +generateLaporan()
    }
    class LaporanTransaksi {
        +id: UUID
        +totalTransaksi: int
        +totalPendapatan: float
        +tanggal: date
        +generateLaporan()
    }
    class StokBahan {
        +id: UUID
        +namaBahan: string
        +jumlah: int
        +satuan: string
        +tambahStok(jumlah)
        +kurangiStok(jumlah)
        +hapusStok()
    }

    User <|-- KepalaToko
    User <|-- Kasir
    User <|-- Koki
    User <|-- Waiter
    KepalaToko --> StokBahan : "Mengelola"
    Waiter --> Pesanan : "Mencatat & Mengantar"
    Koki --> Pesanan : "Memasak & Update Status"
    Kasir --> LaporanTransaksi : "Melihat"
    Kasir --> Pembayaran : "Memproses"
    KepalaToko --> LaporanKeuangan : "Melihat"
    KepalaToko --> LaporanTransaksi : "Melihat"

```

### **Sequence Diagram**
```mermaid
---
config:
  theme: default
---
sequenceDiagram
    participant Pelanggan
    participant Waiter
    participant Koki
    participant Kasir
    participant KepalaToko
    participant Sistem
    
    %% 1. Proses Pemesanan
    Pelanggan->>Waiter: Membuat pesanan
    Waiter->>Sistem: Mencatat pesanan
    Sistem-->>Waiter: Konfirmasi pesanan dicatat
    Waiter->>Koki: Mengirim pesanan ke dapur
    
    %% 2. Proses Memasak
    Koki->>Sistem: Update status pesanan ("Sedang dimasak" → "Selesai")
    Sistem-->>Waiter: Notifikasi pesanan siap
    
    %% 3. Pengantaran Pesanan
    Waiter->>Pelanggan: Mengantarkan pesanan
    
    %% 4. Pembayaran
    Pelanggan->>Kasir: Melakukan pembayaran
    Kasir->>Sistem: Konfirmasi pembayaran
    Sistem-->>Kasir: Status pembayaran tercatat

    %% 5. Kepala Toko Mengelola Sistem
    KepalaToko->>Sistem: Mengelola stok & laporan
    Sistem-->>KepalaToko: Data diperbarui

```

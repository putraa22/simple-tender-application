# Tender Management Application

Aplikasi web untuk mengelola tender dengan fitur drag-and-drop kanban board, autentikasi, dan manajemen produk serta vendor.

## 📋 Daftar Isi

- [Deskripsi](#deskripsi)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Cara Menjalankan Project](#cara-menjalankan-project)
- [Struktur Project](#struktur-project)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Tender Status](#tender-status)
- [Scripts Available](#scripts-available)
- [Build untuk Production](#build-untuk-production)

## 📝 Deskripsi

Aplikasi ini adalah sistem manajemen tender yang memungkinkan user untuk:

- Login dan autentikasi dengan JWT token
- Melihat daftar tender dalam format kanban board
- Membuat tender baru dengan multi-step form
- Mengelola produk dan vendor untuk setiap tender
- Memindahkan tender antar status dengan drag-and-drop

## ✨ Fitur

### Authentication

- Login dengan username dan password
- JWT token management (access token & refresh token)
- Auto logout saat token expired
- Protected routes

### Dashboard

- Kanban board dengan 3 kolom status (Draft, On Going, Completed)
- Drag and drop untuk memindahkan tender antar status
- Summary cards untuk statistik tender
- Sorting options untuk tender
- User dropdown dengan logout

### Create Tender

- Multi-step form dengan 4 tahap:
  1. **General Information**: Nama tender, tanggal, requester, deskripsi
  2. **Products**: Tambah dan kelola produk
  3. **Vendors**: Pilih vendor dari daftar
  4. **Overview**: Review dan start tender
- Validasi form
- Auto-format date ke ISO 8601

## 🛠 Tech Stack

### Core

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool & dev server

### State Management

- **Zustand 5.0.9** - Lightweight state management

### Routing

- **React Router DOM 7.12.0** - Client-side routing

### UI & Styling

- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Lucide React 0.562.0** - Icon library

### Drag & Drop

- **@dnd-kit/core 6.3.1** - Drag and drop core
- **@dnd-kit/sortable 10.0.0** - Sortable components

### HTTP Client

- **Fetch API** - Native browser API (custom wrapper)

## 📦 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (versi 18 atau lebih tinggi)
- **npm** atau **yarn** atau **pnpm**

Untuk mengecek versi Node.js:

```bash
node --version
npm --version
```

## 🚀 Installation

1. **Clone repository** (jika menggunakan git):

```bash
git clone <repository-url>
cd tender-app
```

2. **Install dependencies**:

```bash
npm install
```

atau jika menggunakan yarn:

```bash
yarn install
```

atau jika menggunakan pnpm:

```bash
pnpm install
```

## 🔐 Environment Variables

Buat file `.env` di root project dengan konfigurasi berikut:

```env
VITE_API_BASE_URL=https://vendortest.siloamhospitals.com/tender/api
```

**Catatan:**

- File `.env` tidak di-commit ke repository (sudah ada di `.gitignore`)
- Untuk development, proxy sudah dikonfigurasi di `vite.config.ts`
- Di development, semua request ke `/api/*` akan di-proxy ke backend
- Di production, gunakan `VITE_API_BASE_URL` untuk base URL API

## ▶️ Cara Menjalankan Project

### Development Mode

Jalankan development server:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

**Fitur Development:**

- Hot Module Replacement (HMR) - perubahan kode langsung terlihat
- Proxy untuk API requests (menghindari CORS)
- Source maps untuk debugging

### Preview Production Build

Untuk preview build production secara lokal:

```bash
npm run build
npm run preview
```

### Linting

Cek kode untuk error dan warning:

```bash
npm run lint
```

### Format Code

Format kode dengan Prettier:

```bash
npm run format
```

### Testing

Jalankan test suite:

```bash
npm test
```

## 📁 Struktur Project

```
tender-app/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images dan assets
│   ├── components/        # React components
│   │   ├── create-tender/ # Components untuk create tender
│   │   ├── dashboard/     # Dashboard components
│   │   ├── form/         # Form components
│   │   ├── layout/       # Layout components
│   │   └── tender/       # Tender-related components
│   ├── constants/         # Constants
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables (buat sendiri)
├── package.json          # Dependencies dan scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token

### Tender

- `GET /tender/all` - Get semua tender
- `POST /tender/create` - Create tender baru
- `POST /tender/product/create/:tenderId` - Create product untuk tender

### Vendor

- `GET /vendor/options` - Get daftar vendor options

## 🔄 Authentication Flow

1. User login dengan username dan password
2. Backend mengembalikan `accessToken`, `refreshToken`, dan `user` object
3. Token disimpan di `localStorage` dan Zustand store
4. Setiap API request otomatis menambahkan header `Authorization: Bearer {token}`
5. Jika token expired (401), user otomatis di-logout
6. Refresh token dapat digunakan untuk mendapatkan access token baru

## 📊 Tender Status

Tender memiliki 3 status yang direpresentasikan dengan angka:

- **1 = Draft** - Tender baru dibuat, belum dimulai
- **2 = On Going** - Tender sedang berjalan
- **3 = Completed** - Tender sudah selesai

**Catatan:**

- Tender baru yang dibuat otomatis memiliki status **1 (Draft)**
- Status dapat diubah dengan drag-and-drop di kanban board
- Status mapping: `1 → 'draft'`, `2 → 'ongoing'`, `3 → 'completed'`

## 📜 Scripts Available

### `npm run dev`

Menjalankan development server dengan HMR

### `npm run build`

Build aplikasi untuk production

- Output: `dist/` folder
- Optimized dan minified

### `npm run preview`

Preview production build secara lokal

### `npm run lint`

Cek kode dengan ESLint

### `npm run format`

Format kode dengan Prettier

### `npm test`

Jalankan test suite dengan Vitest

## 🏗 Build untuk Production

1. **Build aplikasi**:

```bash
npm run build
```

2. **Output** akan berada di folder `dist/`

3. **Deploy** folder `dist/` ke hosting service (Vercel, Netlify, dll)

**Catatan untuk Production:**

- Pastikan `VITE_API_BASE_URL` di environment variables production sudah benar
- Pastikan CORS sudah dikonfigurasi di backend
- Pastikan HTTPS digunakan untuk keamanan

## 🐛 Troubleshooting

### CORS Error

Jika mendapat CORS error di development:

- Pastikan proxy sudah dikonfigurasi di `vite.config.ts`
- Pastikan request menggunakan `/api/*` bukan langsung ke backend URL

### Token Expired

Jika token expired:

- User akan otomatis di-logout
- Login ulang untuk mendapatkan token baru

### Build Error

Jika build error:

- Pastikan semua dependencies sudah terinstall: `npm install`
- Cek TypeScript errors: `npm run lint`
- Pastikan environment variables sudah di-set

## 📝 Catatan Penting

1. **Date Format**:
   - Input date menggunakan `type="date"`
   - Waktu otomatis di-set ke waktu sekarang
   - Format yang dikirim ke API: `YYYY-MM-DDTHH:mm:ss` (ISO 8601)

2. **Proxy Configuration**:
   - Development: Request ke `/api/*` di-proxy ke backend
   - Production: Gunakan `VITE_API_BASE_URL` langsung

3. **State Management**:
   - Authentication: `authStore.ts`
   - Tender list: `tenderStore.ts`
   - Create tender: `createTenderStore.ts`

## 👥 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

[Tambahkan license sesuai kebutuhan]

## 👤 Author

[Tambahkan informasi author]

---

**Happy Coding! 🚀**

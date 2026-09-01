# SIMANIS - Frontend ManRisk

Frontend aplikasi **ManRisk (Manajemen Risiko)** yang digunakan untuk pengelolaan dan pemantauan manajemen risiko.

Frontend ini dibangun menggunakan **Next.js**, **React**, dan **TypeScript**, serta terintegrasi dengan Backend API ManRisk.

---

## 📋 Teknologi

- Next.js
- React
- TypeScript
- Tailwind CSS
- NextAuth
- ESLint
- PostCSS
- npm
- Node.js
- PM2 _(untuk production server)_

---

# 📁 Struktur Project

```text
MANRISK-NEXT/
├── .next/                  # Hasil build Next.js (tidak di-push ke Git)
├── node_modules/           # Dependency (tidak di-push ke Git)
├── public/                 # Asset public seperti gambar, icon, dan file statis
├── src/
│   ├── app/                # Halaman dan routing menggunakan Next.js App Router
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context
│   ├── helpers/            # Helper functions
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library dan konfigurasi pendukung
│   ├── schemas/            # Validation schema
│   ├── server/             # Server-side logic
│   ├── stores/             # State management
│   ├── types/              # TypeScript types/interfaces
│   └── proxy.ts            # Proxy/middleware aplikasi
├── .env.development        # Environment development (tidak di-push)
├── .env.production         # Environment production (tidak di-push)
├── .gitignore
├── .prettierignore
├── .prettierrc
├── AGENTS.md
├── auth.routes.ts          # Konfigurasi route authentication
├── CLAUDE.md
├── components.json
├── eslint.config.mjs
├── next-auth.d.ts          # Type declaration NextAuth
├── next.config.ts          # Konfigurasi Next.js
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

> Folder `backend/` yang terdapat pada workspace tidak dibahas dalam README ini karena dokumentasi ini khusus untuk frontend ManRisk.

---

# 🔧 Requirements

Sebelum melakukan instalasi, pastikan komputer/server sudah memiliki:

- Node.js
- npm
- Git

Untuk mengecek instalasi:

```bash
node -v
npm -v
git --version
```

Disarankan menggunakan versi **Node.js LTS**.

---

# 🚀 Instalasi

## 1. Clone Repository

Clone repository frontend dari GitHub:

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
```

Masuk ke folder frontend:

```bash
cd REPOSITORY
```

Contoh:

```bash
cd manrisk-next
```

---

# 2. Install Dependency

Jalankan:

```bash
npm install
```

Perintah tersebut akan membaca `package.json` dan `package-lock.json`, kemudian meng-install seluruh dependency ke folder:

```text
node_modules/
```

Folder `node_modules` tidak perlu di-upload atau di-push ke GitHub.

Jika ingin melakukan instalasi yang benar-benar mengikuti `package-lock.json`, dapat menggunakan:

```bash
npm ci
```

Untuk server production, `npm ci` lebih direkomendasikan apabila `package-lock.json` tersedia.

---

# ⚙️ Environment Configuration

Frontend ManRisk menggunakan environment variable untuk membedakan konfigurasi development dan production.

Environment yang digunakan:

```text
.env.development
.env.production
```

File environment **tidak boleh di-push ke GitHub** karena dapat berisi konfigurasi aplikasi dan informasi rahasia.

---

# 📝 Environment Development

Untuk menjalankan aplikasi pada komputer development, buat file:

```text
.env.development
```

Contoh konfigurasi:

```env
NODE_ENV=development

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

NEXT_PUBLIC_BASE_PATH=

AUTH_URL=http://localhost:3000

NEXTAUTH_URL=http://localhost:3000
```

Sesuaikan nilai tersebut dengan konfigurasi backend yang digunakan.

> Gunakan nama environment variable yang sesuai dengan konfigurasi pada source code project.

---

# 🏭 Environment Production

Untuk menjalankan aplikasi pada server production, buat file:

```text
.env.production
```

Jika aplikasi menggunakan subpath `/manrisk-tes`, contoh konfigurasi:

```env
NODE_ENV=production

NEXT_PUBLIC_APP_URL=https://domain-anda/manrisk-tes

NEXT_PUBLIC_API_BASE_URL=https://domain-anda/manrisk-tes/api

NEXT_PUBLIC_BASE_PATH=/manrisk-tes

AUTH_URL=https://domain-anda/manrisk-tes

NEXTAUTH_URL=https://domain-anda/manrisk-tes
```

Sesuaikan:

```text
https://domain-anda
```

dengan domain server production.

---

# 🔀 Perbedaan Development dan Production

Pada development, aplikasi dapat dijalankan dari root:

```text
http://localhost:3000
```

Sedangkan pada production, apabila Nginx menggunakan subpath:

```text
/manrisk-tes
```

aplikasi dapat diakses melalui:

```text
https://domain-anda/manrisk-tes
```

Contoh:

```text
Development
http://localhost:3000

Production
https://domain-anda/manrisk-tes
```

Konfigurasi `next.config.ts`, `.env.production`, authentication, dan Nginx harus konsisten dengan base path tersebut.

---

# ▶️ Menjalankan Frontend

## Development

Untuk menjalankan frontend dalam mode development:

```bash
npm run dev
```

Kemudian buka browser:

```text
http://localhost:3000
```

---

# 🏗️ Build Production

Sebelum menjalankan aplikasi production, lakukan build:

```bash
npm run build
```

Jika berhasil, Next.js akan menghasilkan folder:

```text
.next/
```

Folder `.next/` merupakan hasil build aplikasi dan tidak perlu di-push ke GitHub.

---

# ▶️ Menjalankan Production

Setelah proses build selesai:

```bash
npm start
```

Secara default aplikasi akan berjalan pada:

```text
http://localhost:3000
```

Jika ingin menggunakan port tertentu:

```bash
npm start -- -p 3000
```

---

# 📦 Deployment ke Server

Urutan deployment yang direkomendasikan:

```text
1. git pull
       ↓
2. npm ci
       ↓
3. konfigurasi .env.production
       ↓
4. npm run build
       ↓
5. npm start / PM2
       ↓
6. Nginx Reverse Proxy
       ↓
7. Browser
```

---

## 1. Masuk ke Folder Project

Contoh:

```bash
cd /var/www/html/manrisk-next
```

Sesuaikan lokasi folder dengan konfigurasi server.

---

## 2. Ambil Source Code Terbaru

```bash
git pull origin main
```

Jika repository menggunakan branch lain, sesuaikan nama branch.

Contoh:

```bash
git pull origin master
```

---

## 3. Install Dependency

```bash
npm ci
```

Jika `package-lock.json` tidak tersedia, gunakan:

```bash
npm install
```

---

## 4. Pastikan `.env.production` Sudah Benar

Periksa file:

```bash
nano .env.production
```

Pastikan konfigurasi frontend, backend API, authentication, dan base path sudah sesuai dengan server production.

---

## 5. Build Aplikasi

```bash
npm run build
```

Pastikan proses build selesai tanpa error.

---

## 6. Jalankan Aplikasi

Untuk testing:

```bash
npm start
```

Jika berhasil, aplikasi dapat diuji melalui:

```text
http://localhost:3000
```

---

# 🏭 Menjalankan Frontend dengan PM2

Untuk production server, aplikasi Next.js disarankan dijalankan menggunakan **PM2**.

## 1. Install PM2

```bash
npm install -g pm2
```

Cek versi PM2:

```bash
pm2 -v
```

---

## 2. Jalankan Next.js dengan PM2

Dari folder project:

```bash
pm2 start npm --name simanis-frontend -- start
```

Cek process:

```bash
pm2 status
```

---

## 3. Melihat Log

```bash
pm2 logs simanis-frontend
```

Untuk melihat 100 baris terakhir:

```bash
pm2 logs simanis-frontend --lines 100
```

---

## 4. Restart

```bash
pm2 restart simanis-frontend
```

---

## 5. Stop

```bash
pm2 stop simanis-frontend
```

---

## 6. Hapus Process

```bash
pm2 delete simanis-frontend
```

---

# 🔄 Menjalankan Setelah Server Restart

Agar PM2 otomatis menjalankan frontend ketika server Linux restart:

```bash
pm2 startup
```

Ikuti perintah yang diberikan oleh PM2.

Kemudian simpan daftar process:

```bash
pm2 save
```

Cek kembali:

```bash
pm2 status
```

---

# 📦 Update Frontend dari GitHub

Jika terdapat perubahan source code di GitHub:

```bash
cd /var/www/html/manrisk-next
```

Kemudian:

```bash
git pull origin main
```

Install dependency jika terdapat perubahan pada `package.json`:

```bash
npm ci
```

Build ulang aplikasi:

```bash
npm run build
```

Setelah build berhasil, restart PM2:

```bash
pm2 restart simanis-frontend
```

Periksa log:

```bash
pm2 logs simanis-frontend
```

---

# 🔄 Urutan Update Production

Setiap kali terdapat update frontend, gunakan urutan:

```bash
git pull origin main
npm ci
npm run build
pm2 restart simanis-frontend
```

Jika tidak terdapat perubahan dependency pada `package.json` atau `package-lock.json`, proses `npm ci` dapat disesuaikan dengan kebutuhan deployment.

---

# 🌐 Nginx Reverse Proxy

Pada production, frontend dapat dijalankan melalui Nginx sebagai reverse proxy.

Contoh arsitektur:

```text
                    Internet
                       │
                       ▼
                ┌─────────────┐
                │    Nginx    │
                │Reverse Proxy│
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Next.js   │
                │ localhost:  │
                │    3000     │
                └──────┬──────┘
                       │
                       │ API
                       ▼
                ┌─────────────┐
                │   Backend   │
                │ ManRisk API │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │ PostgreSQL  │
                └─────────────┘
```

Apabila frontend menggunakan base path:

```text
/manrisk-tes
```

maka URL aplikasi:

```text
https://domain-anda/manrisk-tes
```

Sedangkan API:

```text
https://domain-anda/manrisk-tes/api
```

Konfigurasi Nginx harus disesuaikan dengan konfigurasi `next.config.ts`.

---

# 🔐 Authentication

Frontend ManRisk menggunakan **NextAuth** untuk authentication.

Beberapa file yang berkaitan dengan authentication antara lain:

```text
auth.routes.ts
next-auth.d.ts
src/proxy.ts
src/server/
```

Alur login:

```text
User
  │
  ▼
Frontend Login
  │
  ▼
NextAuth
  │
  ▼
Backend API
  │
  ▼
Database
  │
  ▼
Authentication Result
  │
  ▼
Session
```

Pastikan konfigurasi authentication pada `.env.production` sudah sesuai dengan URL production.

---

# 🛡️ Protected Route

Beberapa halaman aplikasi membutuhkan authentication.

Konfigurasi route authentication dapat ditemukan pada:

```text
auth.routes.ts
```

dan:

```text
src/proxy.ts
```

Apabila menambahkan halaman baru yang membutuhkan login, pastikan route tersebut sudah diperiksa pada konfigurasi authentication/proxy.

---

# 🧹 Lint

Untuk menjalankan ESLint:

```bash
npm run lint
```

Jika terdapat error, perbaiki error tersebut sebelum melakukan deployment production.

---

# 🎨 Formatting

Project menggunakan Prettier.

Konfigurasi terdapat pada:

```text
.prettierrc
.prettierignore
```

Jika tersedia script formatting pada `package.json`, jalankan:

```bash
npm run format
```

Jika script tersebut belum tersedia, formatting dapat dilakukan menggunakan Prettier secara langsung.

---

# 📁 Folder `.next`

Folder:

```text
.next/
```

merupakan hasil build Next.js.

Folder ini tidak perlu di-push ke GitHub karena dapat dibuat kembali dengan:

```bash
npm run build
```

Pastikan `.gitignore` berisi:

```gitignore
.next/
```

---

# 📁 Folder `node_modules`

Folder:

```text
node_modules/
```

berisi dependency project.

Folder ini tidak perlu di-push ke GitHub.

Setelah melakukan clone repository, dependency dapat di-install kembali menggunakan:

```bash
npm ci
```

atau:

```bash
npm install
```

Pastikan `.gitignore` berisi:

```gitignore
node_modules/
```

---

# 🔒 Keamanan

Jangan pernah meng-upload informasi sensitif ke GitHub.

File berikut tidak boleh di-push:

```text
.env
.env.local
.env.development
.env.production
.env.test
```

Jangan menyimpan secara hardcode:

- Password
- API Key
- Authentication Secret
- JWT Secret
- Access Token
- Credential server
- Credential layanan pihak ketiga

Gunakan environment variable.

---

# 📄 `.env.example`

Disarankan membuat file:

```text
.env.example
```

File ini boleh di-push ke GitHub dan digunakan sebagai template konfigurasi.

Contoh:

```env
NODE_ENV=development

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_BASE_PATH=

AUTH_URL=
NEXTAUTH_URL=
```

Nilai asli tetap disimpan pada:

```text
.env.development
.env.production
```

dan kedua file tersebut tidak di-push ke GitHub.

---

# 📌 Git Workflow

Melihat status repository:

```bash
git status
```

Melihat branch:

```bash
git branch
```

Mengambil perubahan terbaru:

```bash
git pull origin main
```

Membuat branch baru:

```bash
git checkout -b nama-branch
```

Setelah melakukan perubahan:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push origin nama-branch
```

---

# 📋 Deployment Checklist

Sebelum deployment ke production, pastikan:

- [ ] Node.js sudah terinstall
- [ ] npm sudah tersedia
- [ ] Repository sudah di-clone
- [ ] Dependency sudah di-install
- [ ] `.env.production` sudah dibuat
- [ ] URL frontend sudah benar
- [ ] URL backend sudah benar
- [ ] Authentication sudah dikonfigurasi
- [ ] Base path sudah benar jika menggunakan subpath
- [ ] `npm run build` berhasil
- [ ] `npm start` berhasil
- [ ] PM2 sudah terinstall
- [ ] PM2 sudah menjalankan frontend
- [ ] `pm2 save` sudah dilakukan
- [ ] PM2 startup sudah dikonfigurasi
- [ ] Nginx sudah dikonfigurasi
- [ ] Frontend dapat diakses melalui domain
- [ ] Login berhasil
- [ ] API dapat terhubung ke backend
- [ ] Protected route berjalan dengan benar
- [ ] Static assets dapat dimuat
- [ ] Tidak terdapat error pada Browser Console
- [ ] Tidak terdapat error pada PM2

---

# 🛠️ Troubleshooting

## Error: Cannot find module

Jika muncul:

```text
Error: Cannot find module 'xxxxx'
```

jalankan:

```bash
npm install
```

atau:

```bash
npm ci
```

Kemudian jalankan kembali aplikasi.

---

## Error: Production build tidak ditemukan

Jika muncul:

```text
Could not find a production build
```

jalankan:

```bash
npm run build
```

Kemudian:

```bash
npm start
```

Jika menggunakan PM2:

```bash
pm2 restart simanis-frontend
```

---

## Error Static Assets / `_next/static`

Jika asset seperti:

```text
/_next/static/
```

tidak dapat ditemukan pada production, periksa:

1. `next.config.ts`
2. `.env.production`
3. `NEXT_PUBLIC_BASE_PATH`
4. Konfigurasi Nginx
5. Hasil `npm run build`

Pastikan konfigurasi base path antara Next.js dan Nginx konsisten.

---

## Login Tidak Berhasil Setelah Deployment

Periksa:

```text
.env.production
```

Terutama:

```text
NEXT_PUBLIC_API_BASE_URL
AUTH_URL
NEXTAUTH_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_BASE_PATH
```

Setelah melakukan perubahan environment, lakukan build ulang:

```bash
npm run build
```

Kemudian restart PM2:

```bash
pm2 restart simanis-frontend
```

---

## API Tidak Dapat Terhubung

Periksa:

```text
NEXT_PUBLIC_API_BASE_URL
```

Pastikan URL backend dapat diakses.

Periksa juga:

- Backend sedang berjalan
- Port backend benar
- Nginx sudah dikonfigurasi
- CORS backend mengizinkan frontend
- URL API tidak salah
- Base path `/manrisk-tes` sudah sesuai

---

## PM2 Tidak Menampilkan Aplikasi

Cek:

```bash
pm2 status
```

Jika frontend belum berjalan:

```bash
pm2 start npm --name simanis-frontend -- start
```

Kemudian:

```bash
pm2 save
```

---

# 📊 Arsitektur Aplikasi

```text
                         USER
                          │
                          ▼
                    ┌───────────┐
                    │  Browser  │
                    └─────┬─────┘
                          │
                          ▼
                    ┌───────────┐
                    │   Nginx   │
                    └─────┬─────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     Next.js     │
                 │    Frontend     │
                 └────────┬────────┘
                          │
                          │ HTTP / API
                          ▼
                 ┌─────────────────┐
                 │     Backend     │
                 │   ManRisk API   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   PostgreSQL    │
                 │    Database     │
                 └─────────────────┘
```

---

# 👨‍💻 Development

Untuk memulai pengembangan:

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
cd REPOSITORY
npm ci
```

Buat file:

```text
.env.development
```

Kemudian isi konfigurasi yang diperlukan.

Jalankan development server:

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```text
http://localhost:3000
```

---

# 📄 License

Internal / Private Project.

Repository ini digunakan untuk kebutuhan internal pengembangan aplikasi **ManRisk** dan tidak untuk didistribusikan tanpa izin.

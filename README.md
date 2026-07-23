## Sistem Informasi Perpustakaan(SIPERPUS)

## Deskripsi

Sistem Informasi Perpustakaan adalah aplikasi web fullstack yang dibangun menggunakan Svelte sebagai frontend dan Express.js sebagai backend dengan database MariaDB menggunakan Drizzle ORM.

Aplikasi ini bertujuan untuk membantu petugas perpustakaan dalam mengelola data buku, kategori buku, dan rak penyimpanan buku. Mahasiswa tidak perlu melakukan login untuk melihat informasi koleksi buku beserta lokasi raknya, sedangkan petugas perpustakaan harus login untuk mengelola data buku, kategori, dan rak.

---

## 👨‍💻 Anggota Kelompok

| Nama | NIM | Kontribusi |
|------|-----|------------|
| Softianto | 2024520009 | Berkontribusi dalam pengembangan frontend dan backend, termasuk perancangan database, pembuatan REST API, autentikasi, integrasi frontend dengan backend, serta pengujian aplikasi. |
| Ismawati | 2024520008| Berkontribusi dalam pengembangan frontend dan backend, termasuk perancangan database, pembuatan REST API, autentikasi, integrasi frontend dengan backend, serta pengujian aplikasi. |

---

## 🗄️ Dokumentasi Skema Database

## Nama Database

```
sistem_informasi_perpus
```

## Tabel Users

Digunakan sebagai akun login petugas perpustakaan.

| Field | Tipe Data |
|--------|-----------|
| id | INT |
| nama | VARCHAR(100) |
| email | VARCHAR(100) |
| password | VARCHAR(255) |

---

## Tabel Kategori Buku

| Field | Tipe Data |
|--------|-----------|
| id | INT |
| nama_kategori | VARCHAR(100) |

---

## Tabel Rak

| Field | Tipe Data |
|--------|-----------|
| id | INT |
| kode_rak | VARCHAR(20) |
| lokasi | VARCHAR(100) |

---

## Tabel Buku

| Field | Tipe Data |
|--------|-----------|
| id | INT |
| judul | VARCHAR(200) |
| penulis | VARCHAR(100) |
| penerbit | VARCHAR(100) |
| tahun_terbit | INT |
| stok | INT |
| id_kategori | INT (Foreign Key) |
| id_rak | INT (Foreign Key) |

---

# ERD (Entity Relationship Diagram)

```text
                     USERS
               (Login Petugas)


+----------------------+
| kategori_buku        |
+----------------------+
| id                   |
| nama_kategori        |
+----------------------+
          │
          │ 1
          │
          │ N
+----------------------+
| buku                 |
+----------------------+
| id                   |
| judul                |
| penulis              |
| penerbit             |
| tahun_terbit         |
| stok                 |
| id_kategori (FK)     |
| id_rak (FK)          |
+----------------------+
          ▲
          │ N
          │
          │ 1
+----------------------+
| rak                  |
+----------------------+
| id                   |
| kode_rak             |
| lokasi               |
+----------------------+
```

### Relasi Database

- Satu kategori memiliki banyak buku (One-to-Many).
- Satu rak dapat menyimpan banyak buku (One-to-Many).

---

# 📡 Dokumentasi Endpoint API

## Authentication

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /auth/register | Registrasi petugas |
| POST | /auth/login | Login petugas |

---

## Buku

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /buku | Menampilkan seluruh data buku |
| GET | /buku/:id | Menampilkan detail buku |
| POST | /buku | Menambahkan buku |
| PUT | /buku/:id | Mengubah data buku |
| DELETE | /buku/:id | Menghapus buku |

---

## Kategori Buku

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /kategori | Menampilkan seluruh kategori |
| GET | /kategori/:id | Detail kategori |
| POST | /kategori | Menambahkan kategori |
| PUT | /kategori/:id | Mengubah kategori |
| DELETE | /kategori/:id | Menghapus kategori |

---

## Rak

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /rak | Menampilkan seluruh rak |
| GET | /rak/:id | Detail rak |
| POST | /rak | Menambahkan rak |
| PUT | /rak/:id | Mengubah rak |
| DELETE | /rak/:id | Menghapus rak |

---

# Contoh Request

## Login

```json
{
  "email": "admin@perpus.com",
  "password": "admin123"
}
```

---

## Tambah Buku

```json
{
  "judul": "Belajar JavaScript",
  "penulis": "Andi",
  "penerbit": "Informatika",
  "tahunTerbit": 2023,
  "stok": 10,
  "idKategori": 1,
  "idRak": 2
}
```

---

## Tambah Kategori

```json
{
  "namaKategori": "Teknologi"
}
```

---

## Tambah Rak

```json
{
  "kodeRak": "A-01",
  "lokasi": "Lantai 1"
}
```

---

# Contoh Response

```json
{
  "message": "Data berhasil disimpan"
}
```

---

# ⚙️ Cara Menjalankan Aplikasi

## 1. Clone Repository

```bash
git clone [ https://github.com/username/SistemInformasiPerpustakaan.git](https://github.com/ismwti/SistemInformasiPerpustakaan_FE) , https://github.com/Sofyant17/SistemInformasiPerpustakaan_BE
```

---

## 2. Menjalankan Backend

```bash
cd backend
npm install
```

Buat file **.env**

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sistem_informasi_perpus

JWT_SECRET=RAHASIA_NEGARA
```

Jalankan server

```bash
npm run dev
```

---

## 3. Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Teknologi yang Digunakan

- Svelte
- Express.js
- TypeScript
- MariaDB
- Drizzle ORM
- JWT Authentication
- bcrypt
- Fetch API
- HTML5
- CSS Flexbox
- CSS Grid

---

# Fitur Aplikasi

- Login Petugas
- CRUD Buku
- CRUD Kategori Buku
- CRUD Rak
- Pencarian Buku
- Responsive Web Design
- JWT Authentication
- Password Hashing menggunakan bcrypt
- Integrasi Frontend dan Backend menggunakan REST API

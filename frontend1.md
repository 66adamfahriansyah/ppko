# Dokumen Desain Frontend (frontend1.md)

Dokumen ini berisi spesifikasi tampilan dan struktur komponen untuk halaman *Frontend* (Home/Landing Page) dan halaman *Admin* pengelola konten, menyesuaikan dengan tema warna aplikasi yang sudah ada (`bg-[#0b5924]`, `text-emerald-700`, `text-emerald-600`, dan `gray-800`).

---

## 1. Desain Halaman Utama (Home Page)

### A. Header (Navbar)
*   **Warna Latar:** Putih (`bg-white`) dengan bayangan tipis (`shadow-sm`) atau transparan dengan efek blur (*glassmorphism*).
*   **Logo/Brand:** Teks "E-BIO PENS | Desa Sajen" dengan warna teks `text-emerald-800` tebal.
*   **Navigasi:** Tautan ke "Beranda", "Komoditas", "Marketplace", dan "Tentang Kami".
*   **Call-to-Action (CTA):** Tombol "Login Dashboard" dengan warna `bg-[#0b5924]` dan teks putih, melengkung penuh (`rounded-full`).

### B. Hero Section
*   **Fokus:** Pertanian Bawang Merah di Desa Sajen, Mojokerto.
*   **Visual:** Gambar latar belakang penuh (*full width*) berkualitas tinggi yang menampilkan hamparan ladang bawang merah di Desa Sajen saat matahari terbit atau petani yang sedang bekerja. Terdapat *overlay* gradien hijau keabu-abuan gelap agar teks mudah dibaca.
*   **Tipografi:**
    *   *Headline:* "Membangun Pertanian Bawang Merah Berkelanjutan di Desa Sajen" (Teks tebal `font-extrabold`, ukuran besar `text-4xl md:text-5xl`, warna putih).
    *   *Sub-headline:* "Menggabungkan kearifan lokal bertani Mojokerto dengan inovasi teknologi untuk hasil panen yang maksimal." (Warna teks `text-emerald-50`, ukuran `text-lg`).
*   **Tombol CTA:** "Lihat Hasil Panen" (`bg-emerald-600 hover:bg-emerald-500`) dan "Marketplace Petani" (Gaya *outline* dengan `border-white`).

### C. Komoditas Section (Sliding Box / Carousel)
*   **Tujuan:** Menampilkan *showcase* hasil panen bawang merah Desa Sajen.
*   **Desain Container:** Latar belakang `bg-emerald-50/50` dengan *padding* luas (`py-16`). Judul section menggunakan warna `text-emerald-900`.
*   **Elemen Sliding Box (Carousel):**
    *   Sebuah *slider* horizontal bergaya modern yang bisa digeser (swipe/scroll).
    *   Setiap *card* (`bg-white`, `rounded-3xl`, `shadow-md`, `border border-gray-100`) berisi:
        *   **Foto Panen:** Foto bawang merah ukuran besar yang memenuhi bagian atas card.
        *   **Label/Bulan:** "Panen Raya [Bulan] [Tahun]" (Warna badge `bg-emerald-100 text-emerald-700`).
        *   **Deskripsi Singkat:** Rangkuman total tonase panen, tingkat kualitas (Super/Standar), dan luas lahan yang dipanen.
*   **Navigasi:** Tombol panah kiri dan kanan melingkar putih dengan bayangan, diletakkan di sisi luar atau sudut *carousel*.

### D. Marketplace Section
*   **Tujuan:** Memfasilitasi promosi dagangan langsung oleh anggota kelompok tani.
*   **Tampilan Grid:** Menampilkan kartu produk (3 kolom pada tampilan desktop, 1-2 kolom pada tampilan mobile) dengan latar abu-abu sangat muda (`bg-gray-50`).
*   **Detail Kartu Produk:**
    *   **Gambar Produk:** Foto hasil tani (misalnya keranjang bawang merah yang sudah siap jual).
    *   **Judul:** "Bawang Merah Super Desa Sajen" (`text-gray-800 font-bold`).
    *   **Harga:** Harga per kg atau per kuintal dengan format rupiah (`text-emerald-700 font-extrabold text-xl`).
    *   **Deskripsi Pertanian:** Penjelasan kualitas produk (misal: "Dipanen dari lereng gunung, pengeringan sempurna, bebas hama berlebih").
    *   **Info Petani:** Nama anggota tani atau nama kelompok dengan ikon `bi-person`.
    *   **Tombol WhatsApp:** Tombol lebar penuh (`w-full`) berwarna `bg-green-500 hover:bg-green-600` dengan ikon `bi-whatsapp` bertuliskan **"Hubungi Petani (WA)"**. Link ini akan membuka `wa.me/628...` dengan template pesan otomatis.

### E. About Section (Kontak Petani & Info Lahan)
*   **Tata Letak:** Terbagi menjadi dua kolom pada layar besar (*Split Layout*).
*   **Kolom Kiri (Cerita & Deskripsi):** Narasi dedikasi para petani Desa Sajen, Mojokerto dalam mengelola lahan pertanian secara berkelanjutan, sejarah demplot, serta integrasi teknologi IoT.
*   **Kolom Kanan (Direktori / Kontak Petani):**
    *   Desain daftar (*list*) elegan (warna latar `bg-[#0b5924]` teks putih atau dibiarkan putih dengan garis tepi).
    *   Daftar kelompok tani (Misal: "Poktan Tani Makmur").
    *   Disertai nomor kontak (Telepon/WA), alamat lengkap posko lahan pertanian, dan nama ketua kelompok.
    *   Menggunakan ikon lokasi (`bi-geo-alt-fill`) dan ikon telepon (`bi-telephone-fill`) berwarna `emerald-500` / `text-emerald-600`.

### F. Footer
*   **Warna Latar:** Hijau sangat gelap (`bg-emerald-900` atau `#06401a`).
*   **Konten:** Logo E-BIO, tautan cepat (Navigasi footer), ikon media sosial, detail alamat lokasi Desa Sajen, Pacet - Mojokerto, dan hak cipta. Teks menggunakan warna `text-emerald-200/60`.

---

## 2. Desain Halaman Admin (CMS)

Halaman Admin CMS digunakan oleh pengurus untuk mengubah isi website pada *Home Page* di atas secara dinamis (tanpa coding). Komponen ini akan diintegrasikan ke *sidebar* navigasi utama (`Sidebar.jsx`) di dashboard.

### A. Layout Utama Halaman Kelola Frontend
*   **Desain Container:** Menyesuaikan dengan gaya dashboard yang sudah ada (`flex-1 p-6`, menggunakan kartu `bg-white rounded-3xl shadow-sm`).
*   **Judul Halaman:** "Kelola Tampilan Website (Landing Page)".
*   **Sistem Tab:** Terdapat menu *Tab* horizontal di bagian atas untuk membagi form agar rapi dan tidak kepanjangan:
    *   `[ Hero Section ]`  `[ Komoditas (Slider) ]`  `[ Marketplace ]`  `[ Tentang Petani ]`

### B. Isi Masing-Masing Tab (Wireframe Logika)

1.  **Tab Hero Section:**
    *   *Input Background:* Form *upload* foto latar belakang hero (Preview gambar kecil di sebelahnya).
    *   *Input Headline:* Textarea singkat untuk mengubah teks judul utama.
    *   *Input Sub-headline:* Textarea untuk mengubah teks sekunder.

2.  **Tab Komoditas (Slider):**
    *   *Daftar Tabel Data:* Menampilkan hasil panen yang saat ini tayang di *slider* (berupa baris).
    *   *Aksi Tambah:* Tombol "Tambah Data Panen" yang akan membuka *Modal (Pop-up)*.
    *   *Isi Modal Tambah/Edit Panen:* Input Bulan/Tahun, Input Gambar Panen, Teks Kualitas, dan Teks Tonase. Terdapat tombol Hapus/Nonaktifkan untuk menyembunyikannya dari *slider*.

3.  **Tab Marketplace:**
    *   *Daftar Tabel Produk:* Menampilkan semua produk dagangan dari kelompok tani.
    *   *Tombol Tambah:* "Tambah Dagangan Baru" -> *Modal (Pop-up)*.
    *   *Isi Modal Tambah/Edit Dagangan:*
        *   Foto Produk.
        *   Nama Produk.
        *   Harga Produk (Rupiah).
        *   Deskripsi Pertanian (Kualitas bawang, dsb).
        *   Nama Petani / Kelompok.
        *   Nomor WhatsApp (Input angka diawali `62`).
    *   *Toggle Status Tayang:* Switch mirip "Mode Otomatis" (`bg-emerald-600` switch bulat) untuk mengatur stok habis (Hide) atau siap jual (Show).

4.  **Tab Tentang Petani:**
    *   *Editor Deskripsi Lahan:* Kotak teks (Textarea multi-baris) untuk mengedit cerita lahan Sajen.
    *   *Kelola Kontak Petani:* Komponen form dinamis (bisa di klik "+ Tambah Kontak").
    *   *Field Kontak:* Nama Poktan, Nama Ketua, Alamat, No Kontak.

### C. Elemen Tombol Aksi (Global Admin)
*   **Tombol Simpan:** Di setiap tab (atau melayang di sudut kanan bawah layar `fixed bottom-6 right-6`), terdapat tombol **"Simpan Perubahan"** berukuran besar, warna `bg-[#0b5924] hover:bg-emerald-800 text-white rounded-xl shadow-lg` beserta ikon `bi-save`.

# WA Floating Form – Plugin WordPress

Plugin floating button WhatsApp dengan form builder yang bisa dikustomisasi langsung dari WP Admin.

## Cara Install

1. Zip semua file ini menjadi `wa-floating-form.zip`
2. Masuk WP Admin → Plugin → Tambah Baru → Upload Plugin
3. Upload file zip, lalu Aktifkan

## Cara Pakai

1. Setelah aktif, buka menu **WA Form** di sidebar WP Admin
2. Isi nomor WhatsApp (format: 628xxx tanpa + atau spasi)
3. Kustomisasi label tombol & teks intro
4. Buat form sesuai kebutuhan di Form Builder:
   - **Short Answer** → input teks bebas (nama, kota, dll)
   - **Pilihan (Radio)** → user pilih satu opsi dari daftar
   - **Button Choice** → pilihan tampil sebagai tombol pill
5. Tulis template pesan WA, gunakan `{Label Field}` untuk sisipkan jawaban
6. Klik **Simpan Pengaturan**

Tombol WhatsApp otomatis muncul di semua halaman setelah nomor WA diisi.

## Struktur File

```
wa-floating-form/
├── wa-floating-form.php   ← Main plugin file
└── assets/
    ├── admin.css          ← Styling halaman admin
    ├── admin.js           ← Form builder UI
    ├── frontend.css       ← Styling tombol & popup
    └── frontend.js        ← Logic frontend
```

## Dibuat oleh
BuatWebsitePro.id

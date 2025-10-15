# Project-Buku-Tamu

📋 **Buku Tamu Digital Lab B201: Sistem Buku Tamu & Jadwal Asisten Lab**
Project ini adalah aplikasi web modern yang dirancang untuk membantu laboratorium multimedia dalam mencatat kunjungan tamu dan mengelola jadwal asisten laboratorium secara efisien dan real-time.

📜 **Tentang Proyek**
Proyek ini dibangun sebagai solusi digital untuk menggantikan proses manual dalam pencatatan tamu dan penjadwalan asisten lab yang rentan terhadap kesalahan dan tidak efisien. Aplikasi web ini menyediakan platform terpusat di mana koordinator lab dapat dengan mudah mengelola data kunjungan dan jadwal, sementara para asisten dapat melihat jadwal tugas mereka dengan jelas.

Aplikasi ini dikembangkan dengan antarmuka yang responsif, memastikan pengalaman pengguna yang baik di berbagai perangkat. Dengan memanfaatkan Supabase sebagai backend, kami mendapatkan kekuatan database PostgreSQL, sistem otentikasi yang aman, dan API instan tanpa perlu mengelola server sendiri.

✨ **Fitur Utama**
- Form Registrasi Terpisah: Antarmuka tab yang intuitif untuk membedakan proses check-in antara Warga Lab (tamu umum) dan Asisten Lab. 
- Pencatatan Tamu (Logbook): Tamu dapat melakukan check-in dengan mengisi nama, NRP, email, dan keperluan. Semua data kunjungan tercatat secara real-time. 
- Absensi Asisten Lab: Asisten lab dapat melakukan check-in menggunakan ID Asisten yang sudah terdaftar dan memilih shift jaga mereka. 
- Dashboard Interaktif: Halaman utama yang menampilkan daftar semua kunjungan (baik tamu maupun asisten) secara real-time.
- Check-out Aman: Proses check-out menggunakan verifikasi kode OTP yang dikirimkan ke email pengguna untuk memastikan keamanan data. 
- Filter dan Pencarian Dinamis: Pengguna dapat dengan mudah mencari data berdasarkan nama, memfilter berdasarkan status ("Di Lab" atau "Selesai"), dan mengurutkan data dari yang terbaru atau terlama. 
- Tampilan Waktu Live: Jam digital yang selalu menampilkan tanggal dan waktu terkini untuk memberikan informasi yang akurat. 


# 👥 Tim Kami & Pembagian Tugas
Proyek ini merupakan hasil kolaborasi dari tiga anggota tim dengan peran yang jelas.

**Frontend Developer**
<br>Arhya Hafidz Hafidin
- Desain UI/UX: Merancang dan mengimplementasikan seluruh antarmuka pengguna (UI) dan pengalaman pengguna (UX), termasuk tata letak, skema warna, dan tipografi menggunakan CSS. 
- Struktur HTML: Mengembangkan struktur HTML semantik untuk halaman registrasi (index.html) dan halaman utama (main.html). 
- Logika Sisi Klien (JavaScript):
  <br>-> Mengimplementasikan logika untuk menampilkan form yang berbeda antara "Warga Lab" dan "Asisten Lab". 
  <br>-> Membangun fungsi untuk interaksi dengan Supabase, seperti mengirim data check-in dan mengambil data kunjungan. 
  <br>-> Mengembangkan fitur dinamis seperti toast notification, jam digital, serta logika untuk filter, pencarian, dan sorting data di halaman utama. 


**Backend Developers**
<br>Atria Caesariano Tinto & Mathew William Junior Tumanggor
- Arsitektur Database: Merancang skema database di Supabase (PostgreSQL), termasuk membuat tabel users (untuk menyimpan data pengguna dan aslab) dan visits (untuk mencatat semua aktivitas kunjungan).
- Manajemen Otentikasi: Mengkonfigurasi dan mengelola layanan Supabase Auth. Mereka merancang alur check-out yang aman menggunakan sistem OTP (One-Time Password) via email.
- Keamanan & Aturan Akses: Menerapkan Row Level Security (RLS) Policies pada tabel untuk memastikan integritas dan keamanan data, misalnya, memastikan hanya pengguna terotentikasi yang dapat melakukan check-out.
- Konfigurasi Realtime: Mengatur fitur Supabase Realtime agar setiap perubahan pada tabel visits (seperti check-in atau check-out baru) dapat langsung ditampilkan di halaman utama tanpa perlu me-refresh halaman.
- Dokumentasi API & Dukungan Frontend: Mendokumentasikan struktur tabel dan membantu tim frontend dalam menyusun query yang efisien dan benar untuk berinteraksi dengan Supabase.

# 🖱️ Clicker Game - Test Your Finger Speed

**Clicker Game** adalah aplikasi web interaktif modern dan responsif untuk menguji seberapa cepat jari Anda melakukan klik dalam durasi waktu 10, 15, atau 30 detik. Dibuat dengan HTML5, CSS3, dan JavaScript vanilla (ES6+), project ini siap untuk langsung di-host secara gratis menggunakan **GitHub Pages**.

---

## ✨ Fitur Utama

- ⏱️ **Pilihan Durasi Variatif**: Mainkan dalam durasi 10 detik, 15 detik, atau 30 detik.
- ⚡ **Hitungan CPS Real-Time**: Menghitung *Clicks Per Second* (CPS) secara presisi pada akhir permainan.
- 🏆 **Sistem High Score**: Rekor tertinggi tersimpan otomatis per durasi menggunakan `localStorage` browser.
- 📢 **Countdown Sebelum Start**: Animasi hitungan mundur 3... 2... 1... GO! sebelum permainan dimulai.
- 🔊 **Efek Suara Instan**: Ditenagai oleh Web Audio API synthesizer (tanpa lag audio) lengkap dengan tombol Mute/Unmute.
- 🔄 **Reset High Score**: Sediakan opsi untuk mengulang rekor dari awal kapan saja.
- 📱 **Desain Responsive & Modern**: Tampilan bersih dengan tema Cyan & White yang nyaman digunakan di Desktop, Tablet, maupun Smartphone.
- 🚫 **Tanpa Framework / Backend**: Murni HTML/CSS/JS tanpa ketergantungan library external berat atau database.

---

## 📁 Struktur Project

```text
clicker-game/
├── index.html       # Struktur HTML5 utama
├── style.css        # Styling CSS3 modern (Variables, Animations & Responsive)
├── script.js        # Logika game, Timer, Sound & High Score localStorage
├── README.md        # Dokumentasi dan panduan penyiapan
└── assets/
    ├── icon.svg     # Icon vector mouse clicker
    └── click.wav    # File audio fallback untuk efek suara
```

---

## 🎮 Cara Bermain

1. Buka file `index.html` pada web browser Anda.
2. Pilih durasi permainan yang diinginkan: **10 Seconds**, **15 Seconds**, atau **30 Seconds**.
3. Tekan tombol **🚀 Start Game**.
4. Tunggu hitungan mundur **3... 2... 1... GO!**.
5. Tekan tombol besar **"CLICK ME!"** sebanyak dan secepat mungkin sebelum waktu habis!
6. Setelah waktu mencapai `0.0s`, hasil permainan Anda (Total Klik, CPS, dan High Score) akan muncul di layar.
7. Tekan **🔄 Play Again** untuk mencoba memecahkan rekor kembali.

---

## 🚀 Panduan Hosting ke GitHub Pages

Project ini dirancang agar dapat di-upload dan dijalankan langsung melalui GitHub Pages.

### Langkah-Langkah Deploy:

1. **Buat Repository Baru di GitHub**:
   - Buka [GitHub](https://github.com/) dan buat repository baru (misalnya diberi nama `clicker-game`).

2. **Upload Seluruh File**:
   - Push atau upload seluruh isi folder `clicker-game/` ke branch `main` repository Anda:
     ```bash
     git init
     git add .
     git commit -m "Initial commit - Clicker Game"
     git branch -M main
     git remote add origin https://github.com/USERNAME/clicker-game.git
     git push -u origin main
     ```

3. **Aktifkan GitHub Pages**:
   - Masuk ke tab **Settings** di repository GitHub Anda.
   - Pada menu sebelah kiri, pilih **Pages**.
   - Di bagian **Build and deployment** > **Source**, pilih **Deploy from a branch**.
   - Pada bagian **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.

4. **Buka Game Anda**:
   - Dalam hitungan beberapa detik/menit, game Anda akan aktif di URL:
     `https://USERNAME.github.io/clicker-game/`

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Elemen semantik & accessibility.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, Grid, Dynamic Animations, dan Glassmorphism.
- **JavaScript (ES6+)**: Event Listeners, Web Audio API, `performance.now()`, dan `localStorage`.

---

## 📄 Lisensi

Project ini bersifat open-source dan bebas digunakan untuk pembelajaran atau dikembangkan lebih lanjut.

# Portal Berita / News Portal

Aplikasi **Portal Berita** ini adalah aplikasi berita sederhana yang dibangun menggunakan Angular 18 (standalone components). Sumber berita diambil dari **NY Times API** untuk berita populer dan berita berdasarkan kategori. Aplikasi ini memanfaatkan **async/await**, **Tailwind CSS** untuk styling, dan **Three.js** untuk animasi partikel latar belakang.

## Fitur Utama
- **REST API**: Mengambil data berita populer dan berita per kategori dari API NY Times.
- **Async & Promise**: Mengelola fetch berita populer dan per kategori dengan async dan promise.
- **Styling**: Menggunakan Tailwind CSS untuk antarmuka yang responsif dan bersih.
- **Routing**: Implementasi routing untuk menavigasi ke komponen `HomeComponent`.
- **State Management**: Menggunakan `BehaviorSubject` dari RxJS untuk state management.
- **Animasi**: Partikel animasi latar belakang menggunakan Three.js.
- **GIT**: Menggunakan Git untuk version control dan penyimpanan di GitHub serta deployment di Vercel.

---

## Prasyarat
- **Node.js** (versi 14 atau lebih baru)
- **Angular CLI** (install dengan `npm install -g @angular/cli`)
- **API Key dari NY Times**: Daftar di [NY Times Developer Portal](https://developer.nytimes.com/) untuk mendapatkan API Key.

## Instalasi
1. **Clone Repository**:
   ```bash
   git clone https://github.com/RifqiTaw/portal-news
   cd portal-news

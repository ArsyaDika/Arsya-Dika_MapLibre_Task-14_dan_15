# Dasar WebGIS dengan MapLibre GL JS

Latihan membangun peta web interaktif dengan MapLibre GL JS: basemap switcher, memuat GeoJSON dari API, layer titik/garis/poligon, popup, dan toggle layer. Dibuat dua versi studi kasus.

Tugas 14 dan 15 bootcamp WebGIS Developer.

| Halaman | Wilayah | Layer |
|---|---|---|
| `index.html` + `app.js` | Bandung | Apartemen (titik), batas administrasi (poligon), drainase 2022 (garis, WFS Geoportal Bandung) |
| `index_smg.html` + `app_SMG.js` | Semarang | Rumah sakit (titik), batas administrasi (poligon), jalan utama (garis, OpenStreetMap via Overpass) |

## Konsep yang dipelajari

- Membuat peta, mengatur `center` dan `zoom`.
- Mengganti basemap dengan `map.setStyle()` dan memasang ulang layer lewat event `style.load`.
- `fetch` GeoJSON, `addSource`, dan `addLayer` (circle, fill, line) dengan urutan layer.
- Popup saat fitur diklik.
- Toggle visibilitas layer dengan `setLayoutProperty`.
- Mengonversi respons Overpass (JSON OSM) menjadi GeoJSON.

## Menjalankan

1. Buat API key MAPID baru, lalu unduh data layer MAPID ke folder `data/`:

   ```bash
   MAPID_API_KEY=xxxx python scripts/download_mapid.py
   ```

2. Jalankan web server lokal, lalu buka `index.html` atau `index_smg.html`:

   ```bash
   python -m http.server 8000
   ```

## Catatan perbaikan

- **API key dihapus dari kode.** Basemap memakai OpenFreeMap, CARTO Dark Matter, dan Esri World Imagery tanpa key. Data MAPID diunduh sekali ke `data/`. Key lama masih ada di riwayat commit, jadi sebaiknya dicabut di dashboard MAPID.
- Layer tidak lagi hilang setelah basemap diganti.
- Tombol toggle langsung bekerja pada klik pertama (sebelumnya perlu dua klik).
- `index_smg.html` sekarang memuat `app_SMG.js` (sebelumnya memuat `app.js` versi Bandung).
- Layer jalan Semarang sekarang tampil: data Overpass dikonversi ke GeoJSON terlebih dulu.
- Popup rumah sakit tidak lagi error karena variabel `jalanData` yang berada di luar jangkauan.

## Tools

MapLibre GL JS · Tailwind CSS · MAPID · OpenStreetMap / Overpass · WFS GeoServer

## Penulis

**Arsya Dika** · [GitHub](https://github.com/ArsyaDika)

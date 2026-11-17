# WebGIS Basics with MapLibre GL JS

How do you build an interactive web map from scratch? These two MapLibre GL JS case studies, one for Bandung and one for Semarang, put the basics together: a basemap switcher, GeoJSON loaded from APIs, point, line and polygon layers, popups and **layer toggles**.

Tasks 14 and 15 of the WebGIS Developer bootcamp.

| Page | Area | Layers |
|---|---|---|
| `index.html` + `app.js` | Bandung | Apartments (points), administrative boundary (polygon), 2022 drainage (lines, Bandung Geoportal WFS) |
| `index_smg.html` + `app_SMG.js` | Semarang | Hospitals (points), administrative boundary (polygon), main roads (lines, OpenStreetMap via Overpass) |

## Concepts practiced

- Creating a map and setting `center` and `zoom`.
- Switching the basemap with `map.setStyle()` and re-adding layers on the `style.load` event.
- `fetch` for GeoJSON, `addSource` and `addLayer` (circle, fill, line) with layer ordering.
- Popups when a feature is clicked.
- Layer visibility toggles with `setLayoutProperty`.
- Converting an Overpass response (OSM JSON) into GeoJSON.

## Running

1. Create a new MAPID API key, then download the MAPID layer data into the `data/` folder:

   ```bash
   MAPID_API_KEY=xxxx python scripts/download_mapid.py
   ```

2. Start a local web server, then open `index.html` or `index_smg.html`:

   ```bash
   python -m http.server 8000
   ```

## Notes on fixes

- **API key removed from the code.** The basemaps use OpenFreeMap, CARTO Dark Matter and Esri World Imagery, all without a key. The MAPID data is downloaded once into `data/`.
- Layers no longer disappear after the basemap is switched.
- The toggle buttons now work on the first click (previously they needed two).
- `index_smg.html` now loads `app_SMG.js` (it previously loaded the Bandung version, `app.js`).
- The Semarang road layer now displays: the Overpass data is converted to GeoJSON first.
- The hospital popup no longer errors because of the out-of-scope `jalanData` variable.

## Tools

MapLibre GL JS · Tailwind CSS · MAPID · OpenStreetMap / Overpass · WFS GeoServer

## Author

**Arsya Dika** · [GitHub](https://github.com/ArsyaDika)

------------------

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

- **API key dihapus dari kode.** Basemap memakai OpenFreeMap, CARTO Dark Matter, dan Esri World Imagery tanpa key. Data MAPID diunduh sekali ke `data/`.
- Layer tidak lagi hilang setelah basemap diganti.
- Tombol toggle langsung bekerja pada klik pertama (sebelumnya perlu dua klik).
- `index_smg.html` sekarang memuat `app_SMG.js` (sebelumnya memuat `app.js` versi Bandung).
- Layer jalan Semarang sekarang tampil: data Overpass dikonversi ke GeoJSON terlebih dulu.
- Popup rumah sakit tidak lagi error karena variabel `jalanData` yang berada di luar jangkauan.

## Tools

MapLibre GL JS · Tailwind CSS · MAPID · OpenStreetMap / Overpass · WFS GeoServer

## Penulis

**Arsya Dika** · [GitHub](https://github.com/ArsyaDika)

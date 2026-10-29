// Basemap gratis tanpa API key
const basemapStreet = 'https://tiles.openfreemap.org/styles/liberty';
const basemapDark = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const basemapSatellite = {
    version: 8,
    sources: {
        esri: {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: 'Imagery © Esri'
        }
    },
    layers: [{ id: 'esri', type: 'raster', source: 'esri' }]
};

// Container id harus sama dengan yang ada di index.html
// style dari API yang ada di const diatas
// center adalah koordinat yang diinginkan untuk ditampilkan, formatnya [longitude, latitude]
// zoom adalah tingkat zoom yang diinginkan, semakin besar semakin detail
const map = new maplibregl.Map({
    container:'map',
    style: basemapStreet,
    center: [110.407609, -6.982276],
    zoom: 12
})
// Data MAPID disimpan sebagai file lokal oleh scripts/download_mapid.py,
// sehingga API key tidak perlu ditulis di kode yang bisa dilihat publik
const url_rs = 'data/rumah_sakit_semarang.geojson'
// Menambahkan url polygon batas adminsitrasi bandung dari API MAPID
const url_administrasi = 'data/administrasi_semarang.geojson'
const url_jalan = 'https://overpass.kumi.systems/api/interpreter?data=[out:json][timeout:25];area[name="Semarang"]["boundary"="administrative"]->.a;(way["highway"~"primary|secondary|tertiary"](area.a););out geom;'

// 'style.load' dipanggil saat peta pertama dimuat DAN setiap kali basemap diganti,
// sehingga layer data tidak hilang setelah setStyle()
map.on('style.load', () =>{
    async function loadData(){
        // Mengambil data rumah sakit dari API menggunakan fetch
        const rsResponse = await fetch(url_rs);
        // Mengubah response menjadi format JSON
        const rsData = await rsResponse.json();

        //Menampilkan data rumah sakit di console untuk memastikan data sudah berhasil diambil
        console.log(rsResponse);
        console.log(rsData);
        
        // Menambahkan data rumah sakit ke peta
        map.addSource('rumah-sakit', {
            type: 'geojson',
            data: rsData
        });

         // Menambahkan layer untuk menampilkan rumah sakit
        map.addLayer({
            id: 'rumah-sakit-layer',
            source: 'rumah-sakit',
            type: 'circle',
            paint : {
                'circle-radius': 6,
                'circle-color': '#22ff7e',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFFFFF'
            }
        })

        // DATA ADMINISTRASI
        // Mengambil data administrasi dari API
        const administrasiResponse = await fetch(url_administrasi);
        // Mengonversi respons menjadi format JSON
        const administrasiData = await administrasiResponse.json();

        // Menambahkan data administrasi ke peta
        map.addSource('administrasi', {
            type: 'geojson',
            data: administrasiData
        });

        // Menambahkan layer untuk menampilkan administrasi
        map.addLayer({
            id: 'administrasi-layer',
            source: 'administrasi',
            type: 'fill',
            paint:{
                'fill-color': '#732d81',
                'fill-opacity': 0.5
            }
        }, 'rumah-sakit-layer') // Menambahkan layer administrasi di bawah layer rumah sakit

        // DATA Jalan
        // Mengambil data jalan dari API
        const jalanResponse = await fetch(url_jalan);
        // Mengonversi respons menjadi format JSON
        const jalanOsm = await jalanResponse.json();
        // Overpass mengembalikan format JSON OSM, bukan GeoJSON, jadi perlu dikonversi dulu.
        // Setiap way (dengan "out geom") punya daftar titik {lat, lon} yang menjadi LineString.
        const jalanData = {
            type: 'FeatureCollection',
            features: jalanOsm.elements
                .filter((el) => el.type === 'way' && el.geometry)
                .map((el) => ({
                    type: 'Feature',
                    properties: { nama: el.tags?.name, kelas: el.tags?.highway },
                    geometry: { type: 'LineString', coordinates: el.geometry.map((p) => [p.lon, p.lat]) }
                }))
        };

        // Menambahkan data jalan ke peta
        map.addSource('jalan', {
            type: 'geojson',
            data: jalanData
        });

        // Menambahkan layer untuk menampilkan jalan
        map.addLayer({
            id: 'jalan-layer',
            source: 'jalan',
            type: 'line',
            paint:{
                'line-color': '#732d81',
                'line-width': 2
            }
        }, 'rumah-sakit-layer') // Menambahkan layer jalan di bawah layer rumah sakit
    }
    loadData();
})

// Menambahkan event listener untuk menangani klik pada layer rumah sakit
map.on('click', 'rumah-sakit-layer', (event)=>{

    // Mendapatkan koordinat klik dan properti fitur yang diklik
    const coordinates = event.lngLat;
    const features = event.features[0].properties;

    // Menampilkan informasi fitur yang diklik di konsol untuk verifikasi
    console.log('FEATURES', features);
    console.log('COORDINATES', coordinates);
    console.log('HASIL EVEN CLICK', event);

    // Membuat konten HTML untuk popup berdasarkan properti fitur
    const html = `
        <div>
            <h1> Informasi Rumah Sakit </h1>
            <p> Nama Rumah Sakit : ${features.NAMA}</p>
            <p> Desa : ${features.DESA}</p>
            <p> Kecamatan : ${features.KECAMATAN}</p>
            <p> Alamat : ${features.ALAMAT}</p>
        </div>
    `

    new maplibregl.Popup() // Membuat popup baru
    .setHTML(html) // Mengatur konten HTML untuk popup
    .setLngLat(coordinates) // Mengatur posisi popup berdasarkan koordinat klik
    .addTo(map); // Menambahkan popup ke peta
});

// Fungsi untuk mengubah gaya peta ke gaya satelit
window.updateStyleToSatellite = ()=>{
    map.setStyle(basemapSatellite, { diff: false })
}
// Fungsi untuk mengubah gaya peta ke gaya dark
window.updateStyleToDark = ()=>{
    map.setStyle(basemapDark, { diff: false })
}
// Fungsi untuk mengubah gaya peta ke gaya street
window.updateStyleToStreet = ()=>{
    map.setStyle(basemapStreet, { diff: false })
}

// Fungsi toggle layer rumah sakit
window.toggleLayerRumahSakit = () =>{
    const visibility = map.getLayoutProperty('rumah-sakit-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'none' ? 'visible' : 'none'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('rumah-sakit-layer', 'visibility', nextState); // Mengubah properti layout untuk layer rumah sakit sesuai dengan status berikutnya
}

// Fungsi toggle layer Administrasi
window.toggleLayerAdministrasi = () =>{
    const visibility = map.getLayoutProperty('administrasi-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'none' ? 'visible' : 'none'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('administrasi-layer', 'visibility', nextState); // Mengubah properti layout untuk layer administrasi sesuai dengan status berikutnya
}

// Fungsi toggle layer Jalan
window.toggleLayerJalan = () =>{
    const visibility = map.getLayoutProperty('jalan-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'none' ? 'visible' : 'none'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('jalan-layer', 'visibility', nextState); // Mengubah properti layout untuk layer jalan sesuai dengan status berikutnya
}
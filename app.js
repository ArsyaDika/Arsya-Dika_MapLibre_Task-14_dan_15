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
    center: [107.605743, -6.916823],
    zoom: 12
})
// Data MAPID disimpan sebagai file lokal oleh scripts/download_mapid.py,
// sehingga API key tidak perlu ditulis di kode yang bisa dilihat publik
const url_apartemen = 'data/apartemen_bandung.geojson'
// Menambahkan url polygon batas adminsitrasi bandung dari API MAPID
const url_administrasi = 'data/administrasi_bandung.geojson'
const url_drainase = 'https://geodata.bandung.go.id/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3ADrainase_2022&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326'

// 'style.load' dipanggil saat peta pertama dimuat DAN setiap kali basemap diganti,
// sehingga layer data tidak hilang setelah setStyle()
map.on('style.load', () =>{
    async function loadData(){
        // Mengambil data apartemen dari API menggunakan fetch
        const apartemenResponse = await fetch(url_apartemen);
        // Mengubah response menjadi format JSON
        const apartemenData = await apartemenResponse.json();

        //Menampilkan data apartemen di console untuk memastikan data sudah berhasil diambil
        console.log(apartemenResponse);
        console.log(apartemenData);
        
        // Menambahkan data apartemen ke peta
        map.addSource('apartemen', {
            type: 'geojson',
            data: apartemenData
        });

         // Menambahkan layer untuk menampilkan apartemen
        map.addLayer({
            id: 'apartemen-layer',
            source: 'apartemen',
            type: 'circle',
            paint : {
                'circle-radius': 6,
                'circle-color': '#FF5722',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFFFFF'
            }
        })

        // DATA ADMINISTRASI
        // Mengambil data apartemen dari API
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
                'fill-color': '#27B4F5',
                'fill-opacity': 0.5
            }
        }, 'apartemen-layer') // Menambahkan layer administrasi di bawah layer apartemen

        // DATA DRAINASE
        // Mengambil data apartemen dari API
        const drainaseResponse = await fetch(url_drainase);
        // Mengonversi respons menjadi format JSON
        const drainaseData = await drainaseResponse.json();

        // Menambahkan data administrasi ke peta
        map.addSource('drainase', {
            type: 'geojson',
            data: drainaseData
        });

        // Menambahkan layer untuk menampilkan drainase
        map.addLayer({
            id: 'drainase-layer',
            source: 'drainase',
            type: 'line',
            paint:{
                'line-color': '#0b65ec',
                'line-width': 2
            }
        }, 'apartemen-layer') // Menambahkan layer administrasi di bawah layer apartemen
    }
    loadData();
})

// Menambahkan event listener untuk menangani klik pada layer apartemen
map.on('click', 'apartemen-layer', (event)=>{

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
            <h1> Informasi Apartemen </h1>
            <p> Nama Apartemen : ${features.NAMA}</p>
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

// Fungsi toggle layer apartemen
window.toggleLayerApartemen = () =>{
    const visibility = map.getLayoutProperty('apartemen-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'none' ? 'visible' : 'none'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('apartemen-layer', 'visibility', nextState); // Mengubah properti layout untuk layer apartemen sesuai dengan status berikutnya
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

// Fungsi toggle layer Drainase
window.toggleLayerDrainase = () =>{
    const visibility = map.getLayoutProperty('drainase-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'none' ? 'visible' : 'none'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('drainase-layer', 'visibility', nextState); // Mengubah properti layout untuk layer drainase sesuai dengan status berikutnya
}
// App.js basemap dasar dari API MAPID
const basemapStreet = 'https://basemap.mapid.io/styles/street-2d-building/style.json?key=69a8edeffdb1d3dbc8b3022c';
const basemapDark = 'https://basemap.mapid.io/styles/dark/style.json?key=69a8edeffdb1d3dbc8b3022c';
const basemapSatellite = 'https://basemap.mapid.io/styles/satellite/style.json?key=69a8edeffdb1d3dbc8b3022c';

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
// Menambahkan url apartemen dari API MApID
const url_apartemen = 'https://geoserver.mapid.io/layers_new/get_layer?api_key=7b8019aa264248e89e3fd5b27253132f&layer_id=69ace1b8643f7636a769ce7c&project_id=69ab9fb96c69e6252868efaf'
// Menambahkan url polygon batas adminsitrasi bandung dari API MAPID
const url_administrasi = 'https://geoserver.mapid.io/layers_new/get_layer?api_key=7b8019aa264248e89e3fd5b27253132f&layer_id=69ace7646c69e62528aa09c5&project_id=69ab9fb96c69e6252868efaf'
const url_drainase = 'https://geodata.bandung.go.id/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3ADrainase_2022&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326'

map.on('load', () =>{
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
    map.setStyle(basemapSatellite)
}
// Fungsi untuk mengubah gaya peta ke gaya dark
window.updateStyleToDark = ()=>{
    map.setStyle(basemapDark)
}
// Fungsi untuk mengubah gaya peta ke gaya street
window.updateStyleToStreet = ()=>{
    map.setStyle(basemapStreet)
}

// Fungsi toggle layer apartemen
window.toggleLayerApartemen = () =>{
    const visibility = map.getLayoutProperty('apartemen-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'visible' ? 'none' : 'visible'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('apartemen-layer', 'visibility', nextState); // Mengubah properti layout untuk layer apartemen sesuai dengan status berikutnya
}

// Fungsi toggle layer Administrasi
window.toggleLayerAdministrasi = () =>{
    const visibility = map.getLayoutProperty('administrasi-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'visible' ? 'none' : 'visible'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('administrasi-layer', 'visibility', nextState); // Mengubah properti layout untuk layer administrasi sesuai dengan status berikutnya
}

// Fungsi toggle layer Drainase
window.toggleLayerDrainase = () =>{
    const visibility = map.getLayoutProperty('drainase-layer', 'visibility')
   
    // ketika diklik keadaannya mati, maka layer dibuat nyala, begitu juga sebaliknya
    const nextState = visibility === 'visible' ? 'none' : 'visible'; // Menentukan status berikutnya berdasarkan status saat ini

    console.log('visibility', visibility);
    console.log('nextState', nextState);
    map.setLayoutProperty('drainase-layer', 'visibility', nextState); // Mengubah properti layout untuk layer drainase sesuai dengan status berikutnya
}
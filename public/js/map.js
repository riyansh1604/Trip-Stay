const map = new mapboxgl.Map({
    accessToken: mapToken ,
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11',
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 11 // starting zoom
});

const markerElement = Object.assign(document.createElement('div'), {
    className: 'custom-marker',
    innerHTML: '<i class="fa-regular fa-house">'
});

const marker = new mapboxgl.Marker( {color : 'red',element: markerElement,anchor: 'bottom'})//element: markerElement,anchor: 'bottom'}
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({offset: 25, className: 'map-class'})
            .setLngLat(coordinates)
            .setHTML(`<h4> ${listing.location} </h4> <p>Exact location will be provided after booking</p>`)
        )
        .addTo(map);
    
map.on('load', () => {
    map.setCenter(coordinates);
    map.addSource('radius', {
        type: 'geojson',
        data: turf.circle(coordinates, 5, {
            units: 'kilometers'
        })
    });

    map.addLayer({
        id: 'radius',
        type: 'fill',
        source: 'radius',
        paint: {
            'fill-color': '#ff385c',
            'fill-opacity': 0.2
        }
    });
});
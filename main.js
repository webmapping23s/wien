/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
};

// Karte initialisieren
let map = L.map("map").setView([
    stephansdom.lat, stephansdom.lng
], 12);

// thematische Layer
let themaLayer = {
    stops: L.featureGroup(),
    lines: L.featureGroup(),
    zones: L.featureGroup(),
    sites: L.featureGroup().addTo(map)
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau").addTo(map),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay")
}, {
    "Vienna Sightseeing Haltestellen": themaLayer.stops,
    "Vienna Sightseeing Linien": themaLayer.lines,
    "Fußgängerzonen": themaLayer.zones,
    "Sehenswürdigkeiten": themaLayer.sites
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Vienna Sightseeing Haltestellen
async function showStops(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(response, jsondata);
    L.geoJSON(jsondata).addTo(themaLayer.stops);
}
showStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

// Vienna Sightseeing Linien
async function showLines(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(response, jsondata);
    L.geoJSON(jsondata).addTo(themaLayer.lines);
}
showLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

// Fußgängerzonen
async function showZones(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(response, jsondata);
    L.geoJSON(jsondata).addTo(themaLayer.zones);
}
showZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

// Sehenswürdigkeiten
async function showSites(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(response, jsondata);
    L.geoJSON(jsondata, {
        onEachFeature: function(feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
                <img src="${prop.THUMBNAIL}" alt="*">
                <h4><a href="${prop.WEITERE_INF}" target="Wien">${prop.NAME}</a></h4>
                <address>${prop.ADRESSE}</address>
            `);
            //console.log(feature.properties, prop.NAME);
        }
    }).addTo(themaLayer.sites);
}
showSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

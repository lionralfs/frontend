import { map, tileLayer } from 'leaflet';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import 'leaflet/dist/leaflet.css';

const cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    radius: 0.1,
    maxOpacity: 0.5,
    blur: 1,
    // scales the radius based on map zoom
    scaleRadius: true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    useLocalExtrema: false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'y',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'x',
    // which field name in your data represents the data value - default "value"
    valueField: 'value',
    onExtremaChange: console.log
};

export function initMap(airData, onVisibleAreaChanged) {
    console.log(airData);
    const osmTileLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const heatmapLayer = new HeatmapOverlay(cfg);

    const leafletMap = map('map', {
        center: [53.551086, 9.993682],
        zoom: 5,
        minZoom: 3,
        layers: [osmTileLayer, heatmapLayer]
    });

    leafletMap.on('zoomend', onVisibleAreaChanged);
    leafletMap.on('moveend', onVisibleAreaChanged);
    heatmapLayer.setData({ data: airData, max: 100 });

    return heatmapLayer;
}
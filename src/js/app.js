import '../css/style.css';
import { fetchData } from './data';
import { initMap } from './air-map';
import { initRangeSlider } from './range-slider';
import { initAirChart, prepareDataForChart } from './air-chart';
import inside from 'point-in-polygon';

(async() => {
    let airChart;
    let sliderPosition = 0;

    const airData = await fetchData();

    const heatmap = initMap(airData[sliderPosition], function visibleAreaChanged(event) {
        const bounds = event.target.getBounds();
        const southWest = bounds._southWest;
        const northEast = bounds._northEast;
        const polygon = [
            [southWest.lng, southWest.lat],
            [southWest.lng, northEast.lat],
            [northEast.lng, northEast.lat],
            [northEast.lng, southWest.lat]
        ];
        const filtered = airData.map(function(interval) {
            return interval.filter(function(measurement) {
                return inside([measurement.lng, measurement.lat], polygon);
            });
        });
        const data = prepareDataForChart(filtered);
        airChart.onDataChange(data);
    });

    initRangeSlider(function onChange(i) {
        sliderPosition = Math.min(i, 23);
        airChart.onSliderChange(23 - sliderPosition);
        heatmap.setData({ data: airData[sliderPosition] });
    });

    airChart = initAirChart(prepareDataForChart(airData));
})();

document.getElementById("openbtn").addEventListener("click", toggleSidebar);
document.getElementById("map").addEventListener("click", hideTextbox);
document.getElementById("about-site").addEventListener("click", showAboutTextbox);
document.getElementById("contact-site").addEventListener("click", showContactTextbox);
document.querySelector('.mobile-open').addEventListener('click', toggleSideBarMobile);
document.querySelector('.mobile-close').addEventListener('click', toggleSideBarMobile);

function toggleSideBarMobile() {
    document.querySelector('.sidebar').classList.toggle('open');
}

function toggleSidebar() {

    let sidebarSize = document.getElementById("sidebar").style.width;
    if (sidebarSize == "30%") {
        return closeSidebar();
    }
    return openSidebar();
}

/*
Opens/closes the sidebar
*/
function openSidebar() {
    document.getElementById("sidebar").style.width = "30%";
    document.getElementById("map-wrapper").style.width = "70%";
    document.getElementById("navbar").style.width = "70%";
    document.getElementById("map").style.width = "200%";
    document.getElementById("openbtn").innerHTML = '&#10005';
}

function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("map-wrapper").style.width = "100%";
    document.getElementById("navbar").style.width = "100%";
    document.getElementById("map").style.width = "200%";
    document.getElementById("openbtn").innerHTML = '&#9776;';
}

function showAboutTextbox() {
    hideTextbox();
    document.getElementById("about").style.display = "block";
}

function showContactTextbox() {
    hideTextbox();
    document.getElementById("contact").style.display = "block";
}

function hideTextbox() {
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "none";
}
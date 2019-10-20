import '../css/style.css';
import 'js-datepicker/dist/datepicker.min.css';
import { getHeatmapForTimestamp } from './data';
import { initMap } from './air-map';
import { initRangeSlider } from './range-slider';
import { initAirChart, prepareDataForChart } from './air-chart';
import inside from 'point-in-polygon';
import datepicker from 'js-datepicker';

function dateToTimestampInSeconds(date) {
    return Math.floor(date.getTime() / 1000);
}

function getTimestampsFromDate(date) {
    const start = dateToTimestampInSeconds(date);
    const timestamps = [];
    for (let i = 0; i < 25; i++) {
        timestamps[i] = start + i * 3600;
    }
    return timestamps;
}

async function getDataForEntireDay(listOfTimestamps, type) {
    const result = [];

    for (const timestamp of listOfTimestamps) {
        try {
            const data = await getHeatmapForTimestamp(timestamp, type);
            result.push(data);
        } catch (e) {
            console.error(e);
            // when an error occurs, use an empty list
            // and continue fetching the other timestamps
            result.push([]);
        }
    }

    return result;
}

(async () => {
    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    const max = 75;
    let type = 'p10';
    let airChart;
    let sliderPosition = now.getUTCHours();

    let timestamps = getTimestampsFromDate(today);
    let dataFullDay = await getDataForEntireDay(timestamps, type);

    const heatmap = initMap(dataFullDay[sliderPosition], max, function visibleAreaChanged(event) {
        const bounds = event.target.getBounds();
        const southWest = bounds._southWest;
        const northEast = bounds._northEast;
        const polygon = [
            [southWest.lng, southWest.lat],
            [southWest.lng, northEast.lat],
            [northEast.lng, northEast.lat],
            [northEast.lng, southWest.lat]
        ];

        const visibleData = [];
        // go through every day of the dataset and filter out
        //everything that is not contained in the polygon
        for (const day of dataFullDay) {
            const filtered = day.filter(function(measurement) {
                return inside([measurement.x, measurement.y], polygon);
            });
            visibleData.push(filtered);
        }
        const data = prepareDataForChart(visibleData);
        airChart.onDataChange(data, type);
    });

    /**
     * When the date in the datepicker changes
     */
    const picker = datepicker('.date-select', {
        onSelect: async (instance, date) => {
            if (!date) {
                date = today;
            }
            const selectedDay = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );

            timestamps = getTimestampsFromDate(selectedDay);
            dataFullDay = await getDataForEntireDay(timestamps, type);

            // update map
            heatmap.setData({ data: dataFullDay[sliderPosition], max: max });

            // update chart
            airChart.onDataChange(prepareDataForChart(dataFullDay), type);
        }
    });
    picker.setDate(today, true);

    /**
     * When the slider position changes
     */
    initRangeSlider(sliderPosition, async function onChange(i) {
        sliderPosition = i;

        heatmap.setData({ data: dataFullDay[sliderPosition], max: max });
    });

    /**
     * When the dust type dropdown changes from p10 <-> p25
     */
    document.querySelector('.type-select').addEventListener('change', async function(evt) {
        type = evt.target.value;

        dataFullDay = await getDataForEntireDay(timestamps, type);
        // update map
        heatmap.setData({ data: dataFullDay[sliderPosition], max: max });
        // update chart
        airChart.onDataChange(prepareDataForChart(dataFullDay), type);
    });

    airChart = initAirChart(prepareDataForChart(dataFullDay), type);
})();

window.addEventListener('DOMContentLoaded', function() {
    // DOM has been fully loaded and parsed
    document.getElementById('openbtn').addEventListener('click', toggleSidebar);

    // targets all elements with the class 'tb-close'
    for (let element of Array.from(document.querySelectorAll('.tb-close'))) {
        element.addEventListener('click', hideTextbox);
    }

    document.getElementById('map').addEventListener('click', hideTextbox);
    document.getElementById('about-site').addEventListener('click', showAboutTextbox);
    document.getElementById('contact-site').addEventListener('click', showContactTextbox);
    document.querySelector('.mobile-open').addEventListener('click', toggleSideBarMobile);
    document.querySelector('.mobile-close').addEventListener('click', toggleSideBarMobile);
});

function toggleSideBarMobile() {
    document.querySelector('.sidebar').classList.toggle('open');
}

function toggleSidebar() {
    hideTextbox();
    let sidebarSize = document.getElementById('sidebar').style.width;
    if (sidebarSize == '30%') {
        return closeSidebar();
    }
    return openSidebar();
}

/*
Opens/closes the sidebar
*/
function openSidebar() {
    document.getElementById('sidebar').style.width = '30%';
    document.getElementById('map-wrapper').style.width = '70%';
    document.getElementById('navbar').style.width = '70%';
    document.getElementById('map').style.width = '200%';
    document.getElementById('openbtn').innerHTML = '&#10005';
}

function closeSidebar() {
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('map-wrapper').style.width = '100%';
    document.getElementById('navbar').style.width = '100%';
    document.getElementById('map').style.width = '200%';
    document.getElementById('openbtn').innerHTML = '&#9776;';
}

function showAboutTextbox() {
    closeSidebar();
    hideTextbox();
    document.getElementById('about').style.display = 'block';
}

function showContactTextbox() {
    closeSidebar();
    hideTextbox();
    document.getElementById('contact').style.display = 'block';
}

function hideTextbox() {
    document.getElementById('contact').style.display = 'none';
    document.getElementById('about').style.display = 'none';
}

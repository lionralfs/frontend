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

(async () => {
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  let airChart;
  let sliderPosition = now.getUTCHours();

  let timestamps = getTimestampsFromDate(today);
  let cached = [];

  const airData = await getHeatmapForTimestamp(Math.floor(now / 1000) - 3600);
  const heatmap = initMap(airData, function visibleAreaChanged(event) {
    // const bounds = event.target.getBounds();
    // const southWest = bounds._southWest;
    // const northEast = bounds._northEast;
    // const polygon = [
    //     [southWest.lng, southWest.lat],
    //     [southWest.lng, northEast.lat],
    //     [northEast.lng, northEast.lat],
    //     [northEast.lng, southWest.lat]
    // ];
    // const filtered = airData.map(function(interval) {
    //     return interval.filter(function(measurement) {
    //         return inside([measurement.lng, measurement.lat], polygon);
    //     });
    // });
    // const data = prepareDataForChart(filtered);
    // airChart.onDataChange(data);
  });

  const picker = datepicker('.date-select', {
    onSelect: async (instance, date) => {
      if (!date) {
        date = today;
      }
      const selectedDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      console.log(selectedDay);
      timestamps = getTimestampsFromDate(selectedDay);
      cached = [];

      const newData = await getHeatmapForTimestamp(timestamps[sliderPosition]);
      cached[sliderPosition] = newData;
      heatmap.setData({ data: newData, max: 500 });
    }
  });
  picker.setDate(today, true);

  initRangeSlider(sliderPosition, async function onChange(i) {
    sliderPosition = i;
    let newData;
    if (cached[sliderPosition]) {
      newData = cached[sliderPosition];
    } else {
      newData = await getHeatmapForTimestamp(timestamps[i]);
      cached[sliderPosition] = newData;
    }
    heatmap.setData({ data: newData, max: 500 });
  });

  // airChart = initAirChart(prepareDataForChart(airData));
})();

document.getElementById('openbtn').addEventListener('click', toggleSidebar);
document.getElementById('map').addEventListener('click', hideTextbox);
document.getElementById('about-site').addEventListener('click', showAboutTextbox);
document.getElementById('contact-site').addEventListener('click', showContactTextbox);
document.querySelector('.mobile-open').addEventListener('click', toggleSideBarMobile);
document.querySelector('.mobile-close').addEventListener('click', toggleSideBarMobile);

function toggleSideBarMobile() {
  document.querySelector('.sidebar').classList.toggle('open');
}

function toggleSidebar() {
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
  hideTextbox();
  document.getElementById('about').style.display = 'block';
}

function showContactTextbox() {
  hideTextbox();
  document.getElementById('contact').style.display = 'block';
}

function hideTextbox() {
  document.getElementById('contact').style.display = 'none';
  document.getElementById('about').style.display = 'none';
}

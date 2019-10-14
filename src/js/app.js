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

  let type = 'p10';
  let airChart;
  let sliderPosition = now.getUTCHours();

  let timestamps = getTimestampsFromDate(today);
  let cached = await getDataForEntireDay(timestamps, type);

  const heatmap = initMap(cached[sliderPosition], function visibleAreaChanged(event) {
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
      cached = await getDataForEntireDay(timestamps, type);

      heatmap.setData({ data: cached[sliderPosition], max: 500 });
    }
  });
  picker.setDate(today, true);

  initRangeSlider(sliderPosition, async function onChange(i) {
    sliderPosition = i;

    // let max = 0;
    // const list = cached[sliderPosition];
    // for (const val of list) {
    //   if (val.value > max) {
    //     max = val.value;
    //   }
    // }

    heatmap.setData({ data: cached[sliderPosition], max: 50 });
  });

  document.querySelector('.type-select').addEventListener('change', async function(evt) {
    type = evt.target.value;

    cached = await getDataForEntireDay(timestamps, type);
    heatmap.setData({ data: cached[sliderPosition], max: 500 });
  });

  // airChart = initAirChart(prepareDataForChart(airData));
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

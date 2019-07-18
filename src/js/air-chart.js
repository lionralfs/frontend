import { Chart } from 'chart.js';
import 'chartjs-plugin-annotation';

export function prepareDataForChart(data) {
    // return data.flat().map(function(measurement) {
    //   return {
    //     x: Number(measurement.timestamp),
    //     y: measurement.p2val
    //   };
    // });
    return data.map(function(measurements, i) {
        return {
            x: i,
            y: measurements.reduce(function(sum, measurement) {
                return sum + measurement.p2val;
            }, 0) / measurements.length
        };
    });
}

export function initAirChart(chartData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'P25 Average',
                data: chartData,
                backgroundColor: '#3700B3',
                spanGaps: true
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        max: 23
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        // max: 10
                    }
                }]
            },
            annotation: {
                events: ['click'],
                annotations: [{
                    drawTime: 'afterDatasetsDraw',
                    id: 'vline',
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x-axis-0',
                    value: 9000, // purposely high
                    borderColor: 'white',
                    borderWidth: 2
                        // label: {
                        //   backgroundColor: 'red',
                        //   content: 'Test Label',
                        //   enabled: true
                        // },
                        // onClick: function(e) {
                        //   // The annotation is is bound to the `this` variable
                        //   console.log('Annotation', e.type, this);
                        // }
                }]
            }
        }
    });

    return {
        onDataChange: function(newData) {
            myChart.data.datasets[0].data = newData;
            myChart.update();
        },
        onSliderChange: function(sliderPosition) {
            myChart.annotation.elements.vline.options.value = sliderPosition;
            myChart.update();
        }
    };
}
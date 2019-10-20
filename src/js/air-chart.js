import { Chart } from 'chart.js';
import 'chartjs-plugin-annotation';

export function prepareDataForChart(data) {
    return data.map(function(measurements, i) {
        const sum = measurements.reduce(function(sum, measurement) {
            return sum + measurement.v;
        }, 0);

        return {
            x: i,
            y: (sum / measurements.length).toFixed(2) // only keep 2 decimal points
        };
    });
}

/**
 * @param {*} chartData
 * @param {'p10' | 'p25'} type
 */
export function initAirChart(chartData, type) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: `${type.toUpperCase()} average`,
                    data: chartData,
                    backgroundColor: '#3700B3',
                    spanGaps: true
                }
            ]
        },
        options: {
            scales: {
                xAxes: [
                    {
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            max: 23
                        }
                    }
                ],
                yAxes: [
                    {
                        type: 'linear',
                        ticks: {
                            // max: 10
                        }
                    }
                ]
            }
        }
    });

    return {
        onDataChange: function(newData, type) {
            myChart.data.datasets[0].data = newData;
            myChart.data.datasets[0].label = `${type.toUpperCase()} average`;
            myChart.update();
        }
    };
}

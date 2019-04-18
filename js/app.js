(async () => {
  const rawData = await d3.csv(
    'https://gist.githubusercontent.com/mbostock/14613fb82f32f40119009c94f5a46d72/raw/d0d70ffb7b749714e4ba1dece761f6502b2bdea2/aapl.csv',
    d3.autoType
  );

  const dummyData = [
    {
      x: 1,
      y: 5
    },
    {
      x: 20,
      y: 20
    },
    {
      x: 40,
      y: 10
    },
    {
      x: 60,
      y: 40
    },
    {
      x: 80,
      y: 5
    },
    {
      x: 100,
      y: 60
    }
  ];

  const stockData = rawData.map(({ close, date }) => {
    // console.dir(date);
    return {
      x: date,
      y: close
    };
  });

  InitChart(stockData);
})();

function InitChart(lineData) {
  const vis = d3
    .select('#chart-1')
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 0 485.4 300')
    .classed('svg-content', true);

  const WIDTH = 485.4;
  const HEIGHT = 300;

  const MARGINS = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
  };

  const xRange = d3
    .scaleLinear()
    .range([MARGINS.left, WIDTH - MARGINS.right])
    .domain([
      d3.min(lineData, function(d) {
        return d.x;
      }),
      d3.max(lineData, function(d) {
        return d.x;
      })
    ]);

  const yRange = d3
    .scaleLinear()
    .range([HEIGHT - MARGINS.top, MARGINS.bottom])
    .domain([
      d3.min(lineData, function(d) {
        return d.y;
      }),
      d3.max(lineData, function(d) {
        return d.y;
      })
    ]);

  const xAxis = d3
    .axisBottom()
    .scale(xRange)
    .tickSize(5);

  const yAxis = d3
    .axisLeft()
    .scale(yRange)
    .tickSize(5);

  vis
    .append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);

  vis
    .append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + MARGINS.left + ',0)')
    .call(yAxis);

  const lineFunc = d3
    .line()
    .x(function(d) {
      return xRange(d.x);
    })
    .y(function(d) {
      return yRange(d.y);
    })
    .curve(d3.curveBasis);

  vis
    .append('svg:path')
    .attr('d', lineFunc(lineData))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
}

const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

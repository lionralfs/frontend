import * as d3 from 'd3';
import '../css/style.css';
import { fetchData } from './data';
import { initMap } from './air-map';
import { initRangeSlider } from './range-slider';

(async () => {
  const airData = await fetchData();
  const heatmap = initMap(airData[0]);

  initRangeSlider(i => {
    heatmap.setData({ data: airData[Math.min(i, 23)] });
  });

  const rawData = await d3.csv(
    'https://gist.githubusercontent.com/mbostock/14613fb82f32f40119009c94f5a46d72/raw/d0d70ffb7b749714e4ba1dece761f6502b2bdea2/aapl.csv',
    d3.autoType
  );

  const stockData = rawData.map(({ close, date }) => {
    return {
      x: date.getTime(),
      y: close
    };
  });

  initChart(stockData);
})();

function initChart(lineData) {
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
    left: 30
  };

  let xMin = Number.POSITIVE_INFINITY;
  let xMax = Number.NEGATIVE_INFINITY;
  let yMin = Number.POSITIVE_INFINITY;
  let yMax = Number.NEGATIVE_INFINITY;
  for (const { x, y } of lineData) {
    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  }

  const xRange = d3
    .scaleLinear()
    .range([MARGINS.left, WIDTH - MARGINS.right])
    .domain([xMin, xMax]);

  const yRange = d3
    .scaleLinear()
    .range([HEIGHT - MARGINS.top, MARGINS.bottom])
    .domain([yMin, yMax]);

  const xAxis = d3
    .axisBottom()
    .scale(xRange)
    .ticks(15)
    .tickSize(5)
    .tickFormat(val => {
      const date = new Date(val);
      return `${date.getMonth()}/${date
        .getFullYear()
        .toString()
        .substr(2, 2)}`;
    });

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
    .attr('class', 'line')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  // append a g for all the mouse over nonsense
  const mouseG = vis.append('g').attr('class', 'mouse-over-effects');

  // this is the vertical line
  mouseG
    .append('path')
    .attr('class', 'mouse-line')
    .style('stroke', 'black')
    .style('stroke-width', '1px')
    .style('opacity', '0');

  // keep a reference to all our lines
  const lines = [...document.querySelectorAll('.lines')];

  // here's a g for each circle and text on the line
  // const mousePerLine = mouseG
  //   .selectAll('.mouse-per-line')
  //   .data(cities)
  //   .enter()
  //   .append('g')
  //   .attr('class', 'mouse-per-line');

  // the circle
  // mousePerLine
  //   .append('circle')
  //   .attr('r', 7)
  //   .style('stroke', function(d) {
  //     return color(d.name);
  //   })
  //   .style('fill', 'none')
  //   .style('stroke-width', '1px')
  //   .style('opacity', '0');

  // // the text
  // mousePerLine.append('text').attr('transform', 'translate(10,3)');

  // rect to capture mouse movements
  mouseG
    .append('svg:rect')
    .attr('width', WIDTH - (MARGINS.left + MARGINS.right))
    .attr('height', HEIGHT)
    .attr('transform', `translate(${MARGINS.left},0)`)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() {
      // on mouse out hide line, circles and text
      d3.select('.mouse-line').style('opacity', '0');
      d3.selectAll('.mouse-per-line circle').style('opacity', '0');
      d3.selectAll('.mouse-per-line text').style('opacity', '0');
    })
    .on('mouseover', function() {
      // on mouse in show line, circles and text
      d3.select('.mouse-line').style('opacity', '1');
      d3.selectAll('.mouse-per-line circle').style('opacity', '1');
      d3.selectAll('.mouse-per-line text').style('opacity', '1');
    })
    .on('mousemove', function() {
      // mouse moving over canvas
      var mouse = d3.mouse(this);

      // move the vertical line
      d3.select('.mouse-line').attr('d', function() {
        const newMouseLeft = mouse[0] + MARGINS.left;
        return `M${newMouseLeft},${HEIGHT} ${newMouseLeft},0`;
      });

      // position the circle and text
      d3.selectAll('.mouse-per-line').attr('transform', function(d, i) {
        console.log(WIDTH / mouse[0]);
        var xDate = x.invert(mouse[0]),
          bisect = d3.bisector(function(d) {
            return d.date;
          }).right;
        idx = bisect(d.values, xDate);

        // since we are use curve fitting we can't relay on finding the points like I had done in my last answer
        // this conducts a search using some SVG path functions
        // to find the correct position on the line
        // from http://bl.ocks.org/duopixel/3824661
        var beginning = 0,
          end = lines[i].getTotalLength(),
          target = null;

        while (true) {
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
            break;
          }
          if (pos.x > mouse[0]) end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break; //position found
        }

        // update the text with y value
        d3.select(this)
          .select('text')
          .text(y.invert(pos.y).toFixed(2));

        // return position
        return 'translate(' + mouse[0] + ',' + pos.y + ')';
      });
    });
}

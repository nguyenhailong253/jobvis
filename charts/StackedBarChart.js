/// author: long nguyen (nguyenhailong253@gmail.com)

import React from 'react';
import * as d3 from 'd3';
import { width, height, margin } from './utils';

const COLORS = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];

class StackedBarChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // xScale: d3.scaleBand().rangeRound([margin.left, width - margin.right]).padding(0.2),
      xScale: d3.scaleTime().range([margin.left, width - margin.right]),
      yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    }

    this.parse = d3.timeFormat('%m-%Y').parse;
    this.xAxis = d3.axisBottom().scale(this.state.xScale).tickFormat(d3.timeFormat('%m-%Y'));
    this.yAxis = d3.axisLeft().scale(this.state.yScale).tickFormat(d => `${d}`);
  }

  createSVG = () => {
    let svg = d3.select('.chart-body')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
    return svg
  }

  createStackedRectangles = (series, svg, xScale, yScale) => {
    // create group for each series, rects for each segment
    let groups = svg.selectAll('g.cost')
      .data(series)
      .enter().append('g')
      .attr('class', 'cost')
      .style('fill', function (d, i) { return COLORS[i]; })

    let rect = groups.selectAll('rect')
      .data(function (d) { return d; })
      .enter()
      .append('rect')
      .attr('x', function (d) { return xScale(d.data.date); })
      .attr('y', function (d) { return yScale(d[0] + d[1]); })
      .attr('height', function (d) { return yScale(d[0]) - yScale(d[0] + d[1]); })
      .attr('width', '25')
  }

  drawAxis = (svg) => {
    svg.append('g')
      .attr('ref', 'xAxis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(this.xAxis);

    svg.append('g')
      .attr('ref', 'yAxis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(this.yAxis);
  }

  drawChart = (data, stacks) => {
    let stackGenerator = d3.stack().keys(stacks); // create a new stack generator

    // generate data for the bar chart
    let series = stackGenerator(data);

    // set domains for x and y
    let xDomain = d3.extent(series[0], function (d) { return d.data.date });
    let yDomain = [0, d3.max(series, function (d) { return d3.max(d, function (d) { return d[0] + d[1]; }) })]
    let xScale = this.state.xScale.domain(xDomain);
    let yScale = this.state.yScale.domain(yDomain);

    // draw axis
    let svg = this.createSVG();
    this.drawAxis(svg);
    this.createStackedRectangles(series, svg, xScale, yScale);
  }

  getArrayOfKeys = (data) => {
    return Object.keys(data[0]).slice(1);
  }

  componentDidMount() {
    let data = this.props.data;
    // convert to date format
    data.forEach(day => day.date = new Date(day.date));
    let stackKeys = this.getArrayOfKeys(data);
    this.drawChart(data, stackKeys);
  }

  render() {
    return (
      <div className="chart-body"></div>
    );
  }
}

export default StackedBarChart;
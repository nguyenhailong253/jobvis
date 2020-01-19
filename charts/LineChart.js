/// author: long nguyen (nguyenhailong253@gmail.com)

import React from 'react';
import * as d3 from 'd3';

import { width, height, margin } from './utils';


class LineChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      jobs: null,
      xScale: d3.scaleTime().range([margin.left, width - margin.right]),
      yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
      lineGenerator: d3.line(),
    }

    this.xAxis = d3.axisBottom().scale(this.state.xScale).tickFormat(d3.timeFormat('%m-%Y'));
    this.yAxis = d3.axisLeft().scale(this.state.yScale).tickFormat(d => `${d}`);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // if no props, return null (do nothing)
    if (!nextProps.data) return null;

    const { data } = nextProps;
    const { xScale, yScale, lineGenerator } = prevState;

    // convert to date format
    data.forEach(day => day.date = new Date(day.date));

    // specify domain (min-max) values for x and y axis
    const xAxisDomain = d3.extent(data, d => d.date); // eg [0, 1]
    const yAxisDomain = d3.max(data, d => d.count); // eg 10000
    xScale.domain(xAxisDomain);
    yScale.domain([0, yAxisDomain]);

    // assign date values to x, count values to y
    lineGenerator.x(d => xScale(d.date));
    lineGenerator.y(d => yScale(d.count));

    // create line 
    const jobs = lineGenerator(data)

    return { jobs };
  }

  handleMouseOver = (event) => {
    // Decrease opacity and increase width
    let target = event.target;
    target.style.opacity = "0.3";
    target.style.strokeWidth = '10';
  }

  handleMouseOut = (event) => {
    // Increase opacity and decrease width
    let target = event.target;
    target.style.opacity = '1';
    target.style.strokeWidth = '2';
  }

  componentDidMount() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {/* Draw line */}
        <path onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          d={this.state.jobs}
          fill='none'
          stroke={this.props.color}
          strokeWidth='2' />

        {/* Axis plane */}
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default LineChart;
/// author: long nguyen (nguyenhailong253@gmail.com)

import React from 'react';
import * as d3 from 'd3';

import { width, height, margin } from './utils';


class MultiLineChart extends React.Component {

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

  static getDerivedStateFromProps(props, state) {
    // if no props, return null (do nothing)
    if (!props.data) return null;

    const { data } = props;
    const { xScale, yScale, lineGenerator } = state;

    let jobs = {}

    let currentXDomain = [0, 1];
    let currentYDomain = [0, 1];

    Object.keys(data).forEach(key => {
      // convert to date format
      data[key].forEach(day => day.date = new Date(day.date));

      // specify domain (min-max) values for x and y axis
      let xDomain = d3.extent(data[key], d => d.date);
      let yMax = d3.max(data[key], d => d.count);
      let yDomain = [0, yMax];

      if (xDomain > currentXDomain) {
        currentXDomain = xDomain;
        currentYDomain = yDomain
        xScale.domain(currentXDomain);
        yScale.domain(currentYDomain);
      }

      // assign date values to x, count values to y
      lineGenerator.x(d => xScale(d.date));
      lineGenerator.y(d => yScale(d.count));

      // create line 
      jobs[key] = lineGenerator(data[key])
    })

    return { jobs }
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
        {Object.keys(this.state.jobs).map(key => {
          return (
            <path onMouseOver={this.handleMouseOver}
              onMouseOut={this.handleMouseOut}
              d={this.state.jobs[key]}
              fill='none'
              stroke={this.props.colors[key]}
              strokeWidth='2' />
          )
        })}

        {/* Axis plane */}
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default MultiLineChart;
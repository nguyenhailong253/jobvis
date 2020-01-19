/// author: long nguyen (nguyenhailong253@gmail.com)

import React from 'react';
import * as d3 from 'd3';

import { width, height, margin } from './utils';


class BarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bars: [],
      xScale: d3.scaleTime().range([margin.left + 15, width - margin.right]),
      yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    }

    this.xAxis = d3.axisBottom().scale(this.state.xScale).tickFormat(d3.timeFormat('%m-%Y'));
    this.yAxis = d3.axisLeft().scale(this.state.yScale);
  }

  static getDerivedStateFromProps(props, state) {
    // if no props, return null (do nothing)
    if (!props.data) return null;

    const { data } = props;
    const { xScale, yScale } = state;

    // convert to date format
    data.forEach(day => day.date = new Date(day.date));

    const xAxisDomain = d3.extent(data, function (d) { return d.date }); // return an array
    const yAxisDomain = d3.max(data, function (d) { return d.count });

    // domain() takse in an array, so for yScale needs [0, maxVal]
    xScale.domain(xAxisDomain);
    yScale.domain([0, yAxisDomain]);

    // process each datum to calculate starting coordinates and height of each bar
    const bars = data.map(d => {
      return {
        x: xScale(d.date) - 10,
        y: yScale(d.count),
        height: height - margin.bottom - yScale(d.count),
      }
    });

    return { bars }
  }

  handleMouseOver = (event) => {
    // Decrease opacity
    let target = event.target;
    target.style.opacity = "0.3";
  }

  handleMouseOut = (event) => {
    // Increase opacity
    let target = event.target;
    target.style.opacity = '1';
  }

  componentDidMount() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {/* Draw line */}
        {this.state.bars.map((d, i) => {
          return (
            <rect onMouseOver={this.handleMouseOver}
              onMouseOut={this.handleMouseOut}
              key={i}
              x={d.x}
              y={d.y}
              width='20'
              height={d.height}
              fill={this.props.color} />
          )
        })}

        {/* Axis plane */}
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left + 15}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default BarChart;
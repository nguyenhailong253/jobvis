/// author: long nguyen (nguyenhailong253@gmail.com)

import React from 'react';
import * as d3 from 'd3';

import { innerRadius, outerRadius, width, height } from './utils';


class PieChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      jobs: null,
      arc: d3.arc().innerRadius(innerRadius).outerRadius(outerRadius),
      // interpolate: d3.interpolateRgb("#eaaf79", "#bc3358"),
      interpolate: d3.interpolateRgb("blue", "red"),
    }
  }

  static getDerivedStateFromProps(props, state) {
    // if no props, return null (do nothing)
    if (!props.data) return null;

    const { data } = props;
    const { arc, interpolate } = state;

    /**
     * pie object = {
     *  data: ...,
     *  endAngle: ...,
     *  index: ...,
     *  padAngle: ...,
     *  startAngle: ...,
     *  value: (=data),
     * }
     */
    let pie = d3.pie()(data); // convert array of data to array of pie object

    const jobs = pie.map((slice, index) => {
      let sliceColor = interpolate(index / (pie.length - 1)); // get index to calculate color
      let datum = arc(slice); // convert pie obj to arc data type string

      return {
        d: datum,
        fill: sliceColor,
      }
    })

    return { jobs };
  }

  render() {
    return (
      <svg width={width} height={height} >
        {/* translate to center of svg */}
        <g transform={`translate(${width / 2}, ${height / 2})`} >
          {this.state.jobs.map((item) => {
            return (
              <path d={item.d} fill={item.fill} />
            );
          })}
        </g>
      </svg>
    );
  }
}

export default PieChart;

// REF: https://medium.com/codenoobs/simple-d3-pie-chart-in-react-eb4237999553
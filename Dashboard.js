/// author: long nguyen (nguyenhailong253@gmail.com)

import React from 'react';
import styled from 'styled-components';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import MultiLineChart from './charts/MultiLineChart';
import PieChart from './charts/PieChart';
import StackedBarChart from './charts/StackedBarChart';

// fake data
import {
  jobsByState,
  jobsByIndustry,
  PieChartMockData,
  StackedBarChartMockData
} from './fake_data/jobs';

const COLORS = {
  // state
  'vic': 'red',
  'nsw': 'blue',
  'act': 'black',
  'qld': 'green',

  // industry
  'Engineering': 'red',
  'IT': 'blue',
  'Finance': 'black',
  'Education': 'green',
}

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
    }
  }

  getData = () => {
    // fetch data from API
    console.log("Fetching data...");
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <DashBoardStyle>

        {/* Jobs by State */}
        <h1 className="dashboard-title">Time series of jobs in each state</h1>
        {Object.keys(jobsByState).map(key => (
          <SubChart>
            <h2 className="chart-title">{key.toUpperCase()}</h2>
            <Charts>
              <LineChart data={jobsByState[key]} color={COLORS[key]} />
              <BarChart data={jobsByState[key]} color={COLORS[key]} />
            </Charts>
          </SubChart>
        ))}

        {/* Jobs by Industry in MultiLine chart */}
        <h1 className="dashboard-title">Time series of jobs in each industry (Multiline Chart)</h1>
        <SubChart>
          <Charts>
            <MultiLineChart data={jobsByIndustry} colors={COLORS} />
          </Charts>
        </SubChart>

        {/* Jobs by Industry in Pie Chart */}
        <h1 className="dashboard-title">Jobs in each industry (Pie Chart)</h1>
        <SubChart>
          <Charts>
            <PieChart data={PieChartMockData} />
          </Charts>
        </SubChart>

        {/* Jobs by Industry in Stacked Bar Chart */}
        <h1 className="dashboard-title">Time series of jobs in each industry (Stacked Bar Chart)</h1>
        <SubChart>
          <Charts>
            <StackedBarChart data={StackedBarChartMockData} />
          </Charts>
        </SubChart>

      </DashBoardStyle>
    );
  }
}

export default Dashboard;

const DashBoardStyle = styled.div`
  margin-top: 2em;

  .dashboard-title {
    margin-top: 1em;
    text-align: center;
    font-size: 5em;
  }
`;

const Charts = styled.div`
  display: flex;
  justify-content: space-around;
`;

const SubChart = styled.div`
  margin: 2em auto;
  .chart-title {
    text-align: center;
    font-size: 3em;
    padding: 1em 0;
  }
`;
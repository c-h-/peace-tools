import React, {
  Component,
  PropTypes,
} from 'react';
import {
  connect,
} from 'react-redux';
import {
  Text,
  View,
} from 'react-native';
import {
  NonIdealState,
} from '@blueprintjs/core';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { scaleTime } from 'd3-scale';
import {
  ChartCanvas,
  Chart,
  series,
  coordinates,
  axes,
} from 'react-stockcharts';

import styles from '../../styles';
import colors from '../../../../constants/colors.json';
import Tooltip from './Tooltip';

const {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} = coordinates;
const {
  AreaSeries,
  LineSeries,
  ScatterSeries,

  CircleMarker,
  SquareMarker,
  TriangleMarker,
} = series;
const {
  XAxis,
  YAxis,
} = axes;

const markers = [
  [
    CircleMarker,
    {
      r: 3,
    },
  ],
  [
    SquareMarker,
    {
      width: 6,
    },
  ],
  [
    TriangleMarker,
    {
      width: 8,
    },
  ],
];

class ChartData extends Component {
  static propTypes = {
    perfReducer: PropTypes.object,
    width: PropTypes.number,
  }
  static defaultProps = {
    width: 0,
  }
  render() {
    const {
      chartData,
      selectedTabID,
      tabs,
    } = this.props.perfReducer;
    const {
      width,
    } = this.props;
    const selectedData = tabs.find(tab => tab.id === selectedTabID);
    let dates = null;
    if (selectedData && selectedData.data) {
      dates = selectedData.data.dates;
    }
    let selectedChartData;
    let seriesCols;
    if (chartData && chartData[selectedData.id] && chartData[selectedData.id].shapedData) {
      selectedChartData = chartData[selectedData.id].shapedData;
      seriesCols = chartData[selectedData.id].columns.filter(col => col !== 'date').sort();
    }
    if (!dates || !selectedChartData || selectedChartData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <NonIdealState
            title="No data"
            description="Fill out the controls and click Compute to show a chart"
            visual="hand-up"
          />
        </View>
      );
    }
    // console.warn('DATE', typeof dates[0]);
    const dateDiffMS = dates[1].getTime() - dates[0].getTime();
    const dateDiffDays = dateDiffMS / 1000 / 60 / 60 / 24;
    const dateRangeIsSmall = dateDiffDays <= 90; // greater than 3 months? don't show ticks
    const height = 400;
    return (
      <ChartCanvas
        width={width}
        height={height}
        ratio={width / height}
        margin={{
          left: 50,
          right: 50,
          top: 30,
          bottom: 30,
        }}
        seriesName="Data"
        data={selectedChartData}
        type="svg"
        xAccessor={d => (d ? d.date : null)}
        xScale={scaleTime()}
        xExtents={dates.map(date => new Date(date))}
      >
        <Chart
          id={0}
          yExtents={(d) => {
            const figs = [];
            for (const key in d) {
              if (key !== 'date') {
                figs.push(d[key]);
              }
            }
            const max = Math.max(...figs);
            const min = Math.min(...figs);
            // add 5% margin above and below
            figs.push(max + ((max - min) * 0.05));
            figs.push(min - ((max - min) * 0.05));
            return figs;
          }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            ticks={6}
          />
          <YAxis
            axisAt="left"
            orient="left"
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%Y-%m-%d')}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.2f')}
          />
          {
            seriesCols.length === 1
            && <AreaSeries yAccessor={d => d[seriesCols[0]]} />
          }
          {
            seriesCols.length !== 1
            && seriesCols.map((col, i) => {
              return (
                <LineSeries
                  yAccessor={d => d[col]}
                  stroke={colors[i % colors.length]}
                  key={`line-${col}`}
                />
              );
            })
          }
          {
            dateRangeIsSmall
            && seriesCols.length !== 1
            && seriesCols.map((col, i) => {
              const color = colors[i % colors.length];
              return (
                <ScatterSeries
                  key={`scatter-${col}`}
                  yAccessor={d => d[col]}
                  marker={markers[i % markers.length][0]}
                  markerProps={{
                    ...markers[i % markers.length][1],
                    stroke: color,
                    fill: color,
                  }}
                />
              );
            })
          }
          <Tooltip forChart={1} origin={[40, -20]} />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

function mapStateToProps(state) {
  return {
    perfReducer: state.perfReducer,
  };
}

export default connect(mapStateToProps)(ChartData);

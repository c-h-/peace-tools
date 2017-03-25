import React, {
  PropTypes,
} from 'react';
import {
  View,
} from 'react-native';
import {
  connect,
} from 'react-redux';
import Blueprint from '@blueprintjs/core';

import '../../../../node_modules/react-select/dist/react-select.css';

import Toolbar from './Toolbar';
import ChartContainer from './Chart';
import StatBlocks from './StatBlocks';

const {
  ProgressBar,
} = Blueprint;

const TabPanel = (props) => {
  const {
    numFetching,
    totalFetching,
    route,
  } = props;
  return (
    <View>
      <View className="pt-card pt-elevation-1">
        <Toolbar />
        {
          numFetching > 0 &&
          <View style={{ position: 'relative' }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1,
              }}
            >
              <ProgressBar
                intent={Blueprint.Intent.PRIMARY}
                value={1 - (numFetching / totalFetching)}
              />
            </View>
          </View>
        }
        { /* Route passing here gets the component to re-render so the chart updates */ }
        <ChartContainer route={route} />
      </View>
      <StatBlocks />
    </View>
  );
};

TabPanel.propTypes = {
  numFetching: PropTypes.number,
  totalFetching: PropTypes.number,
  route: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    route: state.transient.browserRoute,
    numFetching: state.transient
      && state.transient.fetching
      && state.transient.fetching.perfReducer
      && typeof state.transient.fetching.perfReducer.numFetching === 'number'
      ? state.transient.fetching.perfReducer.numFetching
      : 0,
    totalFetching: state.transient
      && state.transient.fetching
      && state.transient.fetching.perfReducer
      && typeof state.transient.fetching.perfReducer.totalFetching === 'number'
      ? state.transient.fetching.perfReducer.totalFetching
      : 0,
  };
}

export default connect(mapStateToProps)(TabPanel);

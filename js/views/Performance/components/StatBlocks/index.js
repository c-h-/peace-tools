import React, {
  Component,
  PropTypes,
} from 'react';
import {
  connect,
} from 'react-redux';
import {
  View,
} from 'react-native';
import isEqual from 'lodash.isequal';

import {
  fetchHeadlines,
} from '../../actions';
import StatBlock from './StatBlock';

import styles from '../../styles';

class StatBlocks extends Component {
  static propTypes = {
    perfReducer: PropTypes.object,
    news: PropTypes.object,
    dispatch: PropTypes.func,
  }
  static getSymbols(tabs, selectedTabID) {
    const selectedData = tabs.find(tab => tab.id === selectedTabID);
    return selectedData
      && selectedData.data
      && selectedData.data.selectedSymbols
      ? selectedData.data.selectedSymbols
      : [];
  }
  constructor(props) {
    super();
    this.checkHeadlines(props);
  }
  componentWillReceiveProps(nextProps) {
    this.checkHeadlines(nextProps, this.props);
  }
  /**
   * Checks if we need to fetch headlines for a symbol
   */
  checkHeadlines = (props, oldProps) => {
    const {
      perfReducer,
      news,
      dispatch,
    } = props;
    const {
      selectedTabID,
      tabs,
    } = perfReducer;
    const symbols = StatBlocks.getSymbols(tabs, selectedTabID);

    // bounce if symbols haven't changed
    if (oldProps) {
      const oldSymbols = StatBlocks.getSymbols(oldProps.perfReducer.tabs, selectedTabID);
      if (isEqual(symbols, oldSymbols)) {
        return;
      }
    }
    if (symbols && symbols.length && typeof symbols.filter === 'function') {
      const toFetch = symbols.filter(symbol => !news[symbol.value]);
      if (toFetch.length) {
        dispatch(fetchHeadlines(toFetch));
      }
    }
  }
  render() {
    const {
      news,
      perfReducer,
    } = this.props;
    const {
      chartData,
      selectedTabID,
      tabs,
    } = perfReducer;
    const symbols = StatBlocks.getSymbols(tabs, selectedTabID);
    if (!symbols || !symbols.length) {
      return null;
    }

    const selectedData = tabs.find(tab => tab.id === selectedTabID);
    let selectedChartData;
    if (chartData && chartData[selectedData.id] && chartData[selectedData.id].shapedData) {
      selectedChartData = chartData[selectedData.id].shapedData;
    }
    const selectedBlockData = [
      selectedChartData[0],
      selectedChartData[selectedChartData.length - 1],
    ];
    return (
      <View style={styles.StatBlocks}>
        {
          symbols.length
          && typeof symbols.map === 'function'
          && symbols.map((col) => {
            return (
              <StatBlock
                key={col.value}
                col={col.value}
                cols={symbols}
                data={selectedBlockData}
                headlines={news[col.value]}
              />
            );
          })
        }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    perfReducer: state.perfReducer,
    news: state.transient.news || {},
  };
}

export default connect(mapStateToProps)(StatBlocks);

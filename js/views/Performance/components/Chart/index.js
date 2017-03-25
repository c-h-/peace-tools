import React, {
  Component,
} from 'react';
import {
  View,
} from 'react-native';

import Chart from './Chart';

class ChartContainer extends Component {
  state = {
    width: 400,
  }
  handleLayout = (e) => {
    if (
      e
      && e.nativeEvent
      && e.nativeEvent.layout
      && e.nativeEvent.layout.width
    ) {
      this.setState({
        width: e.nativeEvent.layout.width,
      });
    }
  }
  render() {
    return (
      <View
        onLayout={this.handleLayout}
      >
        <Chart width={this.state.width} />
      </View>
    );
  }
}

export default ChartContainer;

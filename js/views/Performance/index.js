import React, {
  PropTypes,
} from 'react';
import {
  View,
} from 'react-native';

import styles from './styles';

import TabManager from './components/TabManager';

const Performance = () => {
  return (
    <View style={styles.container}>
      <h2>
        Performance
      </h2>
      <TabManager />
    </View>
  );
};

Performance.contextTypes = {
  store: PropTypes.object,
};

export default Performance;

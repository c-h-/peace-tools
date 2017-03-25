import React from 'react';
import {
  View,
} from 'react-native';

import PortfolioManager from './components/PortfolioManager';

// add blueprint table css
import '../../../node_modules/@blueprintjs/table/dist/table.css';

import styles from './styles';

const Portfolios = () => {
  return (
    <View style={styles.container}>
      <h2>
        Portfolios
      </h2>
      <PortfolioManager />
    </View>
  );
};

export default Portfolios;

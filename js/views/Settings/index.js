import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import {
  connect,
} from 'react-redux';

import styles from './styles';

import {
  updateSetting,
} from './actions';

class Settings extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
  }
  state = {
    quandl: '',
    bing_search: '',
  }
  componentWillMount() {
    this.setState({
      ...this.props.settings,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.settings,
    });
  }
  handleChange = (key) => {
    return (e) => {
      this.setState({
        [key]: e.target.value,
      });
    };
  }
  handleBlur = (key) => {
    const {
      dispatch,
    } = this.props;
    return (e) => {
      dispatch(updateSetting(key, e.target.value));
    };
  }
  render() {
    const {
      quandl,
      bing_search,
    } = this.state;
    return (
      <View style={styles.container}>
        <h2>Settings</h2>
        <Text style={styles.Text}>Change your settings here.</Text>
        <Text style={styles.Text} />
        <Text style={styles.Text} />
        <View style={styles.container} className="pt-card pt-elevation-1">
          <h4>Quandl</h4>
          <Text style={styles.Text}>Quandl API key</Text>
          <TextInput
            style={styles.TextInput}
            value={quandl || ''}
            onBlur={this.handleBlur('quandl')}
            onChange={this.handleChange('quandl')}
          />
          <Text style={styles.Text} />

          <h4>Bing</h4>
          <Text style={styles.Text}>Bing Search API key</Text>
          <TextInput
            style={styles.TextInput}
            value={bing_search || ''}
            onBlur={this.handleBlur('bing_search')}
            onChange={this.handleChange('bing_search')}
          />
          <Text style={styles.Text} />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Settings);

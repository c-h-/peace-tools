import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import ActionTypes from '../redux/action_types.json';
import Icon from './Icon';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    zIndex: 400,
  },
  toolbar: {
    height: 87,
    backgroundColor: 'rgb(206, 217, 224)',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: 'rgb(235, 241, 245)',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
  },
});

const browser = {
  height: '100%',
  width: 350,
  border: 'none',
};

const icon = {
  cursor: 'pointer',
};

class Browser extends Component {
  static propTypes = {
    route: PropTypes.string,
    dispatch: PropTypes.func,
  }
  componentWillReceiveProps(nextProps) {
    const {
      route,
    } = this.props;
    if (route !== nextProps.route && this.iframe) {
      // new route, set current route to '' to reset iframe to improve appearance as it loads
      this.iframe.src = '';
    }
  }
  loadHandler = (ev) => {
    // console.log('Load!', ev.nativeEvent);
  }
  refreshHandler = () => {
    if (this.iframe) {
      this.iframe.style.opacity = '0.5';
      this.iframe.style.filter = 'alpha(opacity=50)'; // IE :|
    }
  }
  goExternal = () => {
    const {
      route,
    } = this.props;
    window.open(route, '_blank');
  }
  closeHandler = () => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: ActionTypes.NAVIGATE_EXTERNAL,
      payload: {
        href: null,
      },
    });
  }
  render() {
    const {
      route,
    } = this.props;
    if (!route || !route.length) {
      return null;
    }
    return (
      <View style={[styles.container, { width: browser.width }]}>
        <View style={styles.toolbar}>
          <View style={styles.buttons}>
            <Icon
              onClick={this.closeHandler}
              name="close"
              style={icon}
            />
            <Icon
              onClick={this.refreshHandler}
              name="refresh"
              style={icon}
            />
            <Icon
              onClick={this.goExternal}
              name="exit-to-app"
              style={icon}
            />
          </View>
        </View>
        <iframe
          src={route}
          onLoad={this.loadHandler}
          style={browser}
          ref={ref => (this.iframe = ref)}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    route: state.transient.browserRoute,
  };
}

export default connect(mapStateToProps)(Browser);

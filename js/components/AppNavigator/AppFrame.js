import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  addNavigationHelpers,
} from 'react-navigation';
import {
  Intent,
} from '@blueprintjs/core';
import ActionTypes from '../../redux/action_types.json';

import SceneContainer from './SceneContainer';
import CustomTabBar from '../CustomTabBar';
import Browser from '../Browser';

const styles = StyleSheet.create({
  container: {
    // fit container size
    flexGrow: 1,
    flexShrink: 0,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
  },
  innerContainer: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: '100%',
    maxHeight: '100vh',
  },
});

class AppFrame extends Component {
  static contextTypes = {
    store: PropTypes.object,
  }
  static propTypes = {
    navigation: PropTypes.object,
    router: PropTypes.object,
    tabBarOptions: PropTypes.object,
  }
  componentDidMount() {
    const {
      dispatch,
    } = this.context.store;
    setTimeout(() => {
      dispatch({
        type: ActionTypes.ERROR,
        payload: {
          intent: Intent.NONE,
          icon: 'thumbs-up',
          msg: 'Peace Tools is currently in Alpha. Please report bugs'
            + ' and issues. Thanks for being here!',
        },
      });
    }, 5000);
    if (document.location.protocol.indexOf('https') > -1) {
      setTimeout(() => {
        dispatch({
          type: ActionTypes.ERROR,
          payload: {
            intent: Intent.WARNING,
            icon: 'warning',
            msg: (
              <span>
                Autocomplete only works over HTTP. Please visit&nbsp;
                <a
                  href="http://peace.tools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  http://peace.tools
                </a>
                &nbsp;for autocomplete support.
              </span>
            ),
          },
        });
      }, 8000);
    }
  }
  /**
   * Go to top of viewport on web when navigation changes
   */
  componentWillReceiveProps(props) {
    if (this.props.navigation.state !== props.navigation.state) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }
  }
  render() {
    // set up navigation
    const {
      navigation,
      router,
      tabBarOptions,
    } = this.props;
    const childNavigation = addNavigationHelpers({
      ...navigation,
      state: navigation.state
        && navigation.state.routes
        ? navigation.state.routes[navigation.state.index]
        : null,
    });
    let Scene = null;
    if (navigation.state) {
      const {
        routes,
        index,
      } = navigation.state;
      if (routes) {
        Scene = router.getComponentForRouteName(routes[index].routeName);
      }
    }
    return (
      <View
        style={styles.container}
      >
        <View
          style={styles.innerContainer}
        >
          <CustomTabBar
            navigation={navigation}
            router={router}
            tabBarOptions={tabBarOptions}
          />
          <SceneContainer>
            <Scene navigation={childNavigation} />
          </SceneContainer>
        </View>
        <Browser />
      </View>
    );
  }
}

export default AppFrame;

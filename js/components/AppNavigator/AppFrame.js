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
  static propTypes = {
    navigation: PropTypes.object,
    router: PropTypes.object,
    tabBarOptions: PropTypes.object,
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

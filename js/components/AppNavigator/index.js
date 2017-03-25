import TabNavigator from './TabNavigator';
import TabRoutes from './TabRoutes';
import sharedTabBarOptions from './sharedTabBarOptions';

const AppNavigator = TabNavigator(TabRoutes, {
  initialRouteName: 'Hello',
  tabBarOptions: sharedTabBarOptions,
});

export default AppNavigator;

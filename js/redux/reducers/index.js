import {
  combineReducers,
} from 'redux';

import AppNavigator from '../../components/AppNavigator';

import transient from './transient';
import cache from './cache';

import perfReducer from '../../views/Performance/reducer';
import portfolios from '../../views/Portfolios/reducer';
import settings from '../../views/Settings/reducer';

export default combineReducers({
  transient,
  nav: (state, action) => {
    return AppNavigator.router.getStateForAction(action, state) || state;
  },
  portfolios,
  perfReducer,
  settings,
  cache,
});

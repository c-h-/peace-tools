import {
  REHYDRATE,
} from 'redux-persist/constants';

import ActionTypes from '../../redux/action_types.json';

const initState = {
  quandl: '',
  bing_search: '',
};

export default function settings(state = initState, action) {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...action.payload.settings,
      };
    }
    case ActionTypes.UPDATE_SETTING: {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    }
    default:
      return state;
  }
}

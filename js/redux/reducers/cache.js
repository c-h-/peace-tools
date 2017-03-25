import {
  REHYDRATE,
} from 'redux-persist/constants';

import hash from '../../utils/fastHash';

import ActionTypes from '../action_types.json';

const initState = {};

export default function cache(state = initState, action) {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...action.payload.cache,
      };
    }
    case ActionTypes.SET_CACHE: {
      return {
        ...state,
        [hash(action.payload.key)]: action.payload.value,
      };
    }
    default:
      return state;
  }
}

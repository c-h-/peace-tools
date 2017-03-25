import Blueprint from '@blueprintjs/core';
import Toaster from '../../components/Toaster';
import ActionTypes from '../action_types.json';

const initState = {
  appReady: false,
  fetching: {},
  news: {},
  browserRoute: null,
};

/**
 * Data that shouldn't be persisted across sessions can be saved here
 */
export default function transient(state = initState, action) {
  switch (action.type) {
    case ActionTypes.NAVIGATE_EXTERNAL: {
      return {
        ...state,
        browserRoute: action.payload.href,
      };
    }
    case ActionTypes.RECEIVE_HEADLINES: {
      if (!action.payload.symbol || !action.payload.data) {
        return state;
      }
      return {
        ...state,
        news: {
          ...state.news,
          [action.payload.symbol]: action.payload.data,
        },
      };
    }
    case ActionTypes.ERROR: {
      // SPECIAL CASE where we need to dispatch the toast but not actually save anything
      Toaster.show({
        message: action.payload.msg,
        intent: Blueprint.Intent.DANGER,
        iconName: 'error',
      });
      return state;
    }
    case ActionTypes.SET_APP_READY: {
      return {
        ...state,
        appReady: action.appReady,
      };
    }
    case ActionTypes.SET_FETCHING: {
      const fetchKey = action.payload.reducer;
      const newFetchingState = {};
      if (typeof action.payload.totalFetching === 'number') {
        newFetchingState.totalFetching = action.payload.totalFetching > 0
          ? action.payload.totalFetching
          : 0;
      }
      if (typeof action.payload.modifier === 'number') {
        const newQueue = state.fetching[fetchKey] && state.fetching[fetchKey].numFetching
          ? state.fetching[fetchKey].numFetching + action.payload.modifier
          : action.payload.modifier;
        newFetchingState.isFetching = newQueue > 0;
        newFetchingState.numFetching = newQueue >= 0 ? newQueue : 0;
      }
      else {
        newFetchingState.isFetching = action.payload.isFetching;
      }
      return {
        ...state,
        fetching: {
          ...state.fetching,
          [fetchKey]: {
            ...state.fetching[fetchKey],
            ...newFetchingState,
          },
        },
      };
    }
    default:
      return state;
  }
}

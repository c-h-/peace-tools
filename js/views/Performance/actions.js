import getAPIUrlsFromMixed from '../../utils/getAPIUrlsFromMixed';

import ActionTypes from '../../redux/action_types.json';
import {
  apiTypes,
  SYM_DELIMETER,
} from '../../constants/misc.json';
import symbolTypes from '../../constants/symbolTypes.json';
import fetchBingSearchAPI from '../../utils/fetchBingSearchAPI';

/**
 * Adds a new comparison tab
 */
export function addNewComparison() {
  return {
    type: ActionTypes.ADD_PERF_TAB,
  };
}

/**
 * Saves comparison tab configuration
 */
export function saveComparison(id, newState) {
  return {
    type: ActionTypes.SAVE_PERF_TAB,
    payload: {
      id,
      newState,
    },
  };
}

/**
 * Deletes a comparison from storage
 */
export function removeComparison(id) {
  return {
    type: ActionTypes.REMOVE_COMPARISON,
    payload: {
      id,
    },
  };
}

/**
 * Set fetching
 */
export function setFetching(modifier = 0, totalFetching) {
  return {
    type: ActionTypes.SET_FETCHING,
    payload: {
      reducer: 'perfReducer',
      modifier,
      totalFetching,
    },
  };
}

/**
 * Switch between perf tabs
 */
export function switchTabs(selectedTabID) {
  return {
    type: ActionTypes.SWITCH_TABS,
    payload: {
      selectedTabID,
      reducer: 'perfReducer',
    },
  };
}

/**
 * Kicks off request process to get data from API
 */
export function fetchUpdatedStats(id, reqData) {
  return (dispatch, getState) => {
    const state = getState();
    const {
      transactions,
    } = state.portfolios;
    const {
      quandl,
    } = state.settings;

    const urls = getAPIUrlsFromMixed(
      reqData.selectedSymbols,
      transactions,
      reqData.dates,
      quandl
    );

    return dispatch({
      type: ActionTypes.FETCH_STATS,
      payload: {
        apiType: apiTypes.QUANDL,
        urls,
      },
      meta: {
        WebWorker: true,
      },
    });
  };
}

/**
 * Fetches headlines for a symbol
 * @param {String} symbol - the symbol to fetch
 */
export function fetchHeadlines(_symbols) {
  return (dispatch, getState) => {
    const state = getState();
    const key = state
      && state.settings
      && state.settings.bing_search
      ? state.settings.bing_search
      : '';
    if (!key || !key.length) {
      dispatch({
        type: ActionTypes.ERROR,
        payload: {
          msg: 'Please provide a Bing Search API key in Settings',
        },
      });
      return;
    }
    fetchBingSearchAPI(dispatch, key, _symbols.map((_symbol) => {
      const symbol = _symbol;
      let val = symbol.value;
      if (val.indexOf(SYM_DELIMETER) > -1) {
        if (val.indexOf(symbolTypes.PORTFOLIO) === 0) {
          return null;
        }
        val = val.slice(val.indexOf(SYM_DELIMETER) + SYM_DELIMETER.length);
      }
      return [
        symbol.value,
        'https://api.cognitive.microsoft.com/bing/v5.0/news/'
          + `search?q=${encodeURIComponent(`${val} ${symbol.name || ''}`)}`
          + '&count=5&offset=0&mkt=en-us&safeSearch=Moderate',
      ];
    }).filter(url => url));
  };
}

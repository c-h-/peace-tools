import checkCacheKeys from '../../utils/checkCacheKeys';
import {
  setFetching,
} from '../../views/Performance/actions';

import ActionTypes from '../action_types.json';

const interceptedTypes = [
  ActionTypes.FETCH_STATS,
];

/**
 * Caches API requests based on serialization of request attributes
 */
export default function (store) {
  return next => (act) => {
    const action = act;

    if (interceptedTypes.includes(action.type)) {
      const {
        cache,
      } = store.getState();
      const currentCacheKeys = Object.keys(cache);

      switch (action.type) {
        case ActionTypes.FETCH_STATS: {
          const keys = action.payload.urls.map(url => url[0]);
          // check if our cache has hits for request being made
          const misses = checkCacheKeys(keys, currentCacheKeys);

          if (misses.length) {
            action.payload.urls = action.payload.urls.filter(url => misses.indexOf(url[0]) > -1);
            // set fetching statuses
            next(setFetching(misses.length, misses.length));
            // build partial chart from cached resources
            next({
              type: ActionTypes.START_CHART_UPDATE_FLOW,
            });
            // get api resources from remote
            return next({
              ...action,
              type: ActionTypes.FETCH_REMOTE,
            });
          }
          else {
            // everything was cached, don't grab anything
            // set fetching to 1 so that loader shows until update flow completes
            next(setFetching(1, 1));
            // build chart from completed data
            return next({
              type: ActionTypes.START_CHART_UPDATE_FLOW,
            });
          }
        }
        default:
          return null;
      }
    }
    return next(action);
  };
}

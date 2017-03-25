import {
  REHYDRATE,
} from 'redux-persist/constants';
import update from 'immutability-helper';

import buildUpdateObj from '../../utils/buildUpdateObj';

import ActionTypes from '../../redux/action_types.json';

function getNewTab(id = 1) {
  return {
    id,
    data: {},
    name: `Analysis ${id}`,
  };
}

const initState = {
  tabs: [
    getNewTab(),
  ],
  chartData: {},
  selectedTabID: 1,
  isFetching: false,
};

export default function perfReducer(state = initState, action) {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...action.payload.perfReducer,
      };
    }
    case ActionTypes.REMOVE_COMPARISON: {
      const id = action.payload.id;
      if (id) {
        const newTabs = state.tabs.filter(tab => tab.id !== id);
        return {
          ...state,
          tabs: newTabs,
          selectedTabID: id !== state.selectedTabID
            ? state.selectedTabID
            : newTabs[0].id,
        };
      }
      return state;
    }
    case ActionTypes.SWITCH_TABS: {
      if (action.payload.reducer === 'perfReducer') {
        return {
          ...state,
          selectedTabID: action.payload.selectedTabID,
        };
      }
      return state;
    }
    case ActionTypes.STORE_CHART_DATA: {
      return {
        ...state,
        chartData: {
          ...state.chartData,
          [action.payload.id]: action.payload.data,
        },
      };
    }
    case ActionTypes.ADD_PERF_TAB: {
      const {
        tabs,
      } = state;
      const newID = tabs.length ? Math.max(...tabs.map(row => row.id)) + 1 : 1;
      return {
        ...state,
        tabs: [
          ...tabs,
          getNewTab(newID),
        ],
      };
    }
    case ActionTypes.SAVE_PERF_TAB: {
      const {
        tabs,
      } = state;
      const {
        id,
        newState,
      } = action.payload;

      let selectedTabID;
      for (const i in tabs) {
        if (tabs[i].id === id) {
          selectedTabID = i;
          break;
        }
      }

      const newTabData = {
        id,
        data: newState,
      };

      const updateObj = buildUpdateObj(selectedTabID.toString(), newTabData);
      const updatedTabs = update(tabs, updateObj);
      return {
        ...state,
        tabs: updatedTabs,
      };
    }
    default:
      return state;
  }
}

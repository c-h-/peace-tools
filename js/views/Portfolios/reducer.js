import {
  REHYDRATE,
} from 'redux-persist/constants';
import update from 'immutability-helper';

import buildUpdateObj from '../../utils/buildUpdateObj';
import ActionTypes from '../../redux/action_types.json';
import defs from '../../constants/assetDefs.json';
import transStructure from '../../constants/transactionStructure.json';

const assetDefs = defs.defs;

const initState = {
  tabs: [
    {
      name: 'My Portfolio',
      createdAt: new Date().getTime(),
      id: 1,
    },
  ],
  transactions: [],
  selectedTabID: 1,
};

export default function portfolios(state = initState, action) {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...action.payload.portfolios,
      };
    }
    case ActionTypes.ADD_PORTFOLIO: {
      const {
        tabs,
      } = state;
      const newID = tabs.length ? Math.max(...tabs.map(row => row.id)) + 1 : 1;
      return {
        ...state,
        tabs: [
          ...tabs,
          {
            id: newID,
            name: action.payload.name,
            createdAt: new Date().getTime(),
          },
        ],
      };
    }
    case ActionTypes.REMOVE_PORTFOLIO: {
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
      if (action.payload.reducer === 'portfolios') {
        return {
          ...state,
          selectedTabID: action.payload.selectedTabID,
        };
      }
      return state;
    }
    case ActionTypes.ADD_TRANSACTION: {
      const {
        transactions,
      } = state;
      const {
        data,
      } = action.payload;
      const newID = transactions.length
        ? Math.max(...transactions.map(trans => trans[transStructure.ID])) + 1
        : 1;
      const newTrans = new Array(Object.keys(transStructure).length);
      newTrans[transStructure.ID] = newID;
      newTrans[transStructure.PID] = data.pid;
      newTrans[transStructure.TYPE] = data.type;
      newTrans[transStructure.SYMBOL] = data.symbol;
      newTrans[transStructure.T_TYPE] = data.t_type;
      newTrans[transStructure.DATE] = data.date && typeof data.date === 'object'
        ? data.date.getTime()
        : data.date;
      newTrans[transStructure.AMOUNT] = data.amount;
      newTrans[transStructure.SHARES] = data.shares;
      newTrans[transStructure.NOTES] = data.notes;
      return {
        ...state,
        transactions: [
          ...transactions,
          newTrans,
        ],
      };
    }
    case ActionTypes.EDIT_TRANSACTION: {
      const {
        col,
        edit,
        rowId,
      } = action.payload;

      const {
        transactions,
      } = state;

      let selectedTransactionIndex;
      let selectedTransaction;
      for (const i in transactions) {
        if (transactions[i][transStructure.ID] === rowId) {
          selectedTransactionIndex = i;
          selectedTransaction = transactions[i];
          break;
        }
      }

      // parse data to saveable format
      let valToSave = edit;
      switch (col) {
        case transStructure.PID:
          // portfolio id
          valToSave = parseInt(edit, 10);
          break;
        case transStructure.TYPE:
          // asset type
          valToSave = assetDefs.find(asset => asset.name.toLowerCase() === edit.toLowerCase()).enum;
          break;
        case transStructure.SYMBOL:
          // symbol
          valToSave = edit.toUpperCase();
          break;
        case transStructure.T_TYPE:
          // transaction type
          valToSave = assetDefs.find((asset) => {
            return asset.enum === selectedTransaction[transStructure.TYPE];
          }).t_types.find(t_type => t_type.name.toLowerCase() === edit.toLowerCase()).enum;
          break;
        case transStructure.DATE:
          // date
          valToSave = new Date(edit).getTime();
          break;
        case transStructure.AMOUNT:
          // amount
          valToSave = parseFloat(edit.replace('$', ''));
          break;
        case transStructure.SHARES:
          // shares
          valToSave = parseFloat(edit);
          break;
        case transStructure.NOTES: // notes
        default:
          break;
      }
      const updateObj = buildUpdateObj(`${selectedTransactionIndex}.${col}`, valToSave);
      const updatedTrans = update(state.transactions, updateObj);
      return {
        ...state,
        transactions: updatedTrans,
      };
    }
    case ActionTypes.REMOVE_TRANSACTION: {
      if (!action.payload || typeof action.payload.id !== 'number') {
        return state;
      }
      return {
        ...state,
        transactions: state.transactions.filter((trans) => {
          return trans[transStructure.ID] !== action.payload.id;
        }),
      };
    }
    default:
      return state;
  }
}

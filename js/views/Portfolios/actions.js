/**
 * Export feature imports
 */
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ActionTypes from '../../redux/action_types.json';
import transStructure from '../../constants/transactionStructure.json';
import assetDefs from '../../constants/assetDefs.json';

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
  for(var R = 0; R != data.length; ++R) {
    for(var C = 0; C != data[R].length; ++C) {
      if(range.s.r > R) range.s.r = R;
      if(range.s.c > C) range.s.c = C;
      if(range.e.r < R) range.e.r = R;
      if(range.e.c < C) range.e.c = C;
      var cell = {v: data[R][C] };
      if(cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      
      if(typeof cell.v === 'number') cell.t = 'n';
      else if(typeof cell.v === 'boolean') cell.t = 'b';
      else if(cell.v instanceof Date) {
        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';
      
      ws[cell_ref] = cell;
    }
  }
  if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}
function Workbook() {
  if (!(this instanceof Workbook)) {
    return new Workbook();
  }
  this.SheetNames = [];
  this.Sheets = {};
}


/**
 * Adds a new portfolio
 */
export function addPortfolio(portfolioName) {
  return {
    type: ActionTypes.ADD_PORTFOLIO,
    payload: {
      name: portfolioName,
    },
  };
}

/**
 * Deletes a portfolio
 * @param {Number} id - the id of the portfolio to remove
 */
export function removePortfolio(id) {
  return {
    type: ActionTypes.REMOVE_PORTFOLIO,
    payload: {
      id,
    },
  };
}

/**
 * Adds a transaction to a portfolio
 */
export function addTransaction(data) {
  return {
    type: ActionTypes.ADD_TRANSACTION,
    payload: {
      data,
    },
  };
}

/**
 * Takes the row and column index of the edit and parses the edit to
 * the right datatype before storing
 */
export function editTransaction(rowId, col, edit) {
  return {
    type: ActionTypes.EDIT_TRANSACTION,
    payload: {
      rowId,
      col,
      edit,
    },
  };
}

/**
 * Delete a transaction
 */
export function removeTransaction(id) {
  return {
    type: ActionTypes.REMOVE_TRANSACTION,
    payload: {
      id,
    },
  };
}

/**
 * Switch between perf tabs
 */
export function switchTabs(portfolioID) {
  return {
    type: ActionTypes.SWITCH_TABS,
    payload: {
      selectedTabID: portfolioID,
      reducer: 'portfolios',
    },
  };
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

/**
 * Exports an Excel doc of current portfolios
 */
export function exportExcelDoc() {
  return (dispatch, getState) => {
    const state = getState();
    if (state && state.portfolios) {
      const workbook = new Workbook();
      const {
        rows,
        transactions,
      } = state.portfolios;
      // create sheets
      rows.forEach((row) => {
        workbook.SheetNames.push(row.name);
        // add column headings
        const sheetData = [];
        for (const key in transStructure) {
          const columnIndex = transStructure[key];
          let val;
          switch (columnIndex) {
            case transStructure.ID:
              // transaction ID
              val = 'Transaction ID';
              break;
            case transStructure.PID:
              // portfolio id
              val = 'Portfolio ID';
              break;
            case transStructure.TYPE:
              // asset type
              val = 'Asset Type';
              break;
            case transStructure.T_TYPE:
              // transaction type
              val = 'Transaction Type';
              break;
            case transStructure.DATE:
              val = 'Date';
              break;
            case transStructure.AMOUNT:
              val = 'Amount/Price';
              break;
            case transStructure.NOTES:
              val = 'Notes';
              break;
            case transStructure.SHARES:
              val = 'Shares';
              break;
            case transStructure.SYMBOL:
              val = 'Symbol';
              break;
            default:
              break;
          }
          if (!sheetData[0]) {
            sheetData[0] = [];
          }
          sheetData[0][columnIndex] = val;
        }
        // add transactions
        transactions.filter(trans => trans[transStructure.PID] === row.id)
          .forEach((transaction, _i) => {
            const i = _i + 1;
            if (!sheetData[i]) {
              sheetData[i] = [];
            }
            transaction.forEach((transValue, j) => {
              let value = transValue;
              switch (j) {
                case transStructure.TYPE: {
                  // asset type
                  value = assetDefs.defs.find(asset => asset.enum === parseInt(value, 10)).name;
                  break;
                }
                case transStructure.T_TYPE: {
                  // transaction type
                  value = assetDefs
                    .defs
                    .find(asset => asset.enum === parseInt(transaction[transStructure.TYPE], 10))
                    .t_types
                    .find(t_type => t_type.enum === parseInt(value, 10)).name;
                  break;
                }
                case transStructure.DATE: {
                  value = new Date(value).toString();
                  break;
                }
                case transStructure.AMOUNT: {
                  value = parseFloat(value) || 0;
                  break;
                }
                case transStructure.NOTES:
                case transStructure.SYMBOL:
                default:
                  break;
              }
              sheetData[i][j] = value;
            });
          });
        // console.warn('SHEET DATA', sheetData);
        workbook.Sheets[row.name] = sheet_from_array_of_arrays(sheetData);
      });
      if (rows.length) {
        const wopts = {
          bookType: 'xlsx',
          bookSST: true,
          type: 'binary',
        };

        const wbout = XLSX.write(workbook, wopts);
        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'test.xlsx');
      }
      else {
        dispatch({
          type: ActionTypes.ERROR,
          payload: {
            msg: 'Nothing to export',
          },
        });
      }
    }
  };
}

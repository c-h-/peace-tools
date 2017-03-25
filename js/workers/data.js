import ActionTypes from '../redux/action_types.json';
import getSymbols from '../utils/getSymbols';
import {
  SYM_DELIMETER,
  chartModes,
} from '../constants/misc.json';
import transStructure from '../constants/transactionStructure.json';
import {
  setFetching,
} from '../views/Performance/actions';
import symbolTypes from '../constants/symbolTypes.json';

const dispatch = self.postMessage;

const QUANDL_STOCK_COLUMNS = {
  DATE: 0,
  OPEN: 1,
  HIGH: 2,
  LOW: 3,
  CLOSE: 4,
  VOLUME: 5,
  EX_DIVIDEND: 6,
  SPLIT_RATIO: 7,
  ADJ_OPEN: 8,
  ADJ_HIGH: 9,
  ADJ_LOW: 10,
  ADJ_CLOSE: 11,
  ADJ_VOLUME: 12,
};
const QUANDL_CURRENCY_COLUMNS = {
  DATE: 0,
  AVG_24: 1,
  ASK: 2,
  BID: 3,
  LAST: 4,
  VOLUME: 5,
};
const YQL_STOCK_COLUMNS = {
  DATE: 'Date',
  OPEN: 'Open',
  ADJ_CLOSE: 'Adj_Close',
  CLOSE: 'Close',
  HIGH: 'High',
  LOW: 'Low',
  OPEN: 'Open',
  SYMBOL: 'Symbol',
  VOLUME: 'Volume',
}

const CURRENCIES = ['USD', 'ETH', 'BTC'];

/**
 * Perform expensive data shaping here in reducer to save the main thread's framerate
 */
function shapeResponse(data, symbol) {
  const t = symbol.indexOf(SYM_DELIMETER) > -1 ? symbol.split(SYM_DELIMETER) : symbol;
  const symbolParts = {
    type: Array.isArray(t) ? t[0] : symbolTypes.USER_INPUT,
    symbol: Array.isArray(t) ? t[1] : symbol,
  };
  const valueColName = `${symbolParts.type}${SYM_DELIMETER}${symbolParts.symbol}`;
  if (data && data.dataset && data.dataset.data && data.dataset.column_names) {
    // Quandl format
    let valueColumnToKeep;
    let colsDef;
    switch (data.dataset.database_code) {
      case 'BAVERAGE':
        valueColumnToKeep = QUANDL_CURRENCY_COLUMNS.AVG_24;
        colsDef = QUANDL_CURRENCY_COLUMNS;
        break;
      case 'WIKI':
      default:
        valueColumnToKeep = QUANDL_STOCK_COLUMNS.CLOSE;
        colsDef = QUANDL_STOCK_COLUMNS;
        break;
    }
    const shaped = data.dataset.data.map((row) => {
      return {
        date: row[colsDef.DATE],
        [valueColName]: row[valueColumnToKeep],
      };
    });
    shaped.columns = ['date', valueColName];
    return shaped;
  }
  else if (data && data.query && data.query.results && data.query.results.quote) {
    // YQL historical format
    const shaped = data.query.results.quote.map((quote) => {
      return {
        date: quote[YQL_STOCK_COLUMNS.DATE],
        [valueColName]: quote[YQL_STOCK_COLUMNS.CLOSE],
      };
    });
    shaped.columns = ['date', valueColName];
    return shaped;
  }
  else {
    return false;
  }
}

/**
 * gets stats from a date
 */
/*
function getStats(date) {
  const d = date instanceof Date ? date : new Date(date);
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth(),
    d: d.getUTCDate(),
  };
}
*/

/**
 * Compares 2 date stats.
 * Returns 0 if dates are same.
 * Returns 1 if d1 is more recent than d2
 * Returns -1 if d1 is more stale than d2
 */
/*
function compareStats(d1, d2) {
  if (d1.y === d2.y) {
    if (d1.m === d2.m) {
      if (d1.d === d2.d) {
        return 0;
      }
      else {
        return d1.d > d2.d ? 1 : -1;
      }
    }
    else {
      return d1.m > d2.m ? 1 : -1;
    }
  }
  else {
    return d1.y > d2.y ? 1 : -1;
  }
}
*/

/**
 * Unused function for making sure there's a data point for every point in time.
 * Would be easy to build interpolation into this function.
 */
/*
function ensureDataPointForEveryPointInTime(dates, shapedData, columns) {
  // ensure there's points for every date in range
  const start = new Date(dates[0]).getTime();
  const end = dates[1] ? new Date(dates[1]).getTime() : start;
  if (start < end) {
    let toAdd = new Date(shapedData[0].date).getTime();
    while (toAdd <= end) {
      let point;
      let pointIndex;
      const newStats = getStats(toAdd);
      for (const i in shapedData) {
        const currStats = getStats(shapedData[i].date);
        const statPlacement = compareStats(newStats, currStats);
        if (statPlacement === 0) {
          // point exists
          point = shapedData[i];
          pointIndex = i;
          break;
        }
        // newStats represents a date more stale than shapedData point
        else if (statPlacement === -1) {
          // contents are sorted chronologically so if date is larger, means we don't
          // have date we're looking for
          pointIndex = i;
          break;
        }
      }
      if (!point && pointIndex) {
        // no point at all, add one at pointIndex
        const newVal = {};
        // set new values to zero
        columns.forEach(col => (newVal[col] = 0));
        // add date
        newVal.date = toAdd;
        shapedData.splice(pointIndex, 0, newVal);
      }
      else if (point && pointIndex) {
        // ensure every value is set
        columns.forEach((col) => {
          if (!point[col] && col !== 'date') {
            point[col] = 0;
          }
        });
      }
      // go to next day
      toAdd += 1000 * 60 * 60 * 24; // 1000 ms/s * 60 s/m * 60 m/h * 24 h/d => 1 day in ms
    }
  }
  return shapedData;
}
*/

/**
 * Sets value props from a point to obj
 */
function setValues(point, obj = {}) {
  const o = obj;
  if (!o.date && point.date) {
    o.date = point.date;
  }
  for (const key in point) {
    if (key !== 'date') {
      o[key] = +point[key];
    }
  }
  return o;
}

/**
 * Prepares api data for charting display
 */
function normalizeData(data, dates) {
  const shapedData = [];

  // edge case where only asset is cash and therefore no data from api
  if (data.length === 0) {
    const start = dates[0];
    const end = dates[1];
    if (start instanceof Date && end instanceof Date) {
      const points = [];
      const pointer = start;
      while (pointer <= end) {
        points.push({
          date: pointer.getTime(),
          USD: 1,
        });
        pointer.setDate(pointer.getDate() + 1);
      }
      data.push(points.reverse());
    }
  }

  // merge data points
  data.forEach((dataset) => {
    if (dataset) {
      dataset.forEach((point) => {
        const shapedPoint = shapedData.find((x) => {
          return x.date === point.date;
        });
        if (shapedPoint) {
          setValues(point, shapedPoint);
        }
        else {
          shapedData.push(setValues(point));
        }
      });
    }
  });

  // get columns
  const columns = shapedData[0] ? Object.keys(shapedData[0]) : ['date'];

  // chronological order
  shapedData.reverse();

  // unneccessary
  // ensureDataPointForEveryPointInTime();

  // convert to all ms time
  shapedData.forEach((p) => {
    const point = p;
    if (typeof point.date === 'string') {
      point.date = new Date(point.date).getTime();
    }
  });

  return {
    columns,
    shapedData,
  };
}

/**
 * Takes normalized data and processes
 */
function processPortfolios(normalizedData, payload) {
  const {
    symbols,
    transactions,
    portfolios,
  } = payload;
  const symbolWhitelist = ['date'];

  symbols.forEach((group) => {
    if (group.value && group.value.indexOf(`${symbolTypes.PORTFOLIO}${SYM_DELIMETER}`) === 0) {
      // looking at a portfolio
      // need to calculate when values are positive and accumulate those sums.
      // once we have sums for every data point, add a new key to normalizedData.shapedData
      // for the portfolio
      const portfolioSymbols = getSymbols([group.value], transactions);
      const portfolioID = parseInt(group.value.split(SYM_DELIMETER)[1], 10);
      const portfolioName = portfolios.find((port) => {
        return port.id === portfolioID;
      }).name;
      // make sure we don't delete the portfolio
      symbolWhitelist.push(portfolioName);
      normalizedData.shapedData.forEach((point, _i) => {
        let portfolioValue = 0;
        portfolioSymbols.forEach((symbol) => {
          const tickerSymbol = symbol.indexOf(SYM_DELIMETER) > -1
            ? symbol.slice(symbol.indexOf(SYM_DELIMETER) + SYM_DELIMETER.length)
            : symbol;
          const tickerType = symbol.indexOf(SYM_DELIMETER) > -1
            ? symbol.slice(0, symbol.indexOf(SYM_DELIMETER))
            : symbolTypes.USER_INPUT;
          // for each symbol, grab the value at the point and then apply portfolio transaction
          // transformations to the value
          const symbolTransactions = transactions.filter((trans) => {
            return trans[transStructure.SYMBOL].toUpperCase() === tickerSymbol
              && trans[transStructure.PID] === portfolioID
              && trans[transStructure.DATE] <= point.date;
          }).sort((a, b) => a[transStructure.DATE] - b[transStructure.DATE]);

          if (
            (tickerType === symbolTypes.CURRENCY || tickerType === symbolTypes.USER_INPUT)
            && CURRENCIES.indexOf(tickerSymbol) > -1
          ) {
            // process currency
            const amountAtDate = symbolTransactions.reduce((acc, curr) => {
              return curr[transStructure.AMOUNT]
                ? acc + parseFloat(curr[transStructure.AMOUNT])
                : acc;
            }, 0);

            // model exchange rate as multiplier. effect is to show value of holdings
            // in foreign currency in USD as reported by exchange rate
            const multiplier = point[symbol] ? point[symbol] : 1;

            // add the cash value to the portfolio's value
            portfolioValue += amountAtDate
              ? parseFloat((multiplier * amountAtDate).toFixed(2))
              : 0;
            if (_i === normalizedData.shapedData.length - 1) {
              console.log('symbol', symbol, symbolTransactions, amountAtDate,
                multiplier, point[symbol], portfolioValue);
            }
          }
          else {
            // process stocks (ignore etfs)
            // the shares owned at this point's date for the portfolio
            const sharesAtDate = symbolTransactions.reduce((acc, curr) => {
              return curr[transStructure.SHARES]
                ? acc + parseFloat(curr[transStructure.SHARES])
                : acc;
            }, 0);

            // add the shares' value to the portfolio's value
            portfolioValue += point[symbol]
              ? parseFloat((point[symbol] * sharesAtDate).toFixed(2))
              : 0;
          }
        });

        // add the portfolio's datapoint
        const p = point;
        p[portfolioName] = portfolioValue;
      });
    }
    else {
      // looking at a basic symbol
      symbolWhitelist.push(group.value.toUpperCase());
    }
  });

  // remove unused basic symbol45s from normalizedData
  // do this before adding more data to normalizedData
  normalizedData.shapedData.forEach((point) => {
    for (const key in point) {
      const p = point;
      if (symbolWhitelist.indexOf(key) === -1) {
        delete p[key];
      }
    }
  });

  return symbolWhitelist;
}

/**
 * Converts comparison mode data into summed mode data
 */
function applySummingMode(normalizedData) {
  normalizedData.shapedData.forEach((point) => {
    const p = point;
    let acc = 0;
    for (const key in point) {
      if (key !== 'date' && point[key]) {
        acc += p[key];
        delete p[key];
      }
    }
    p.Value = acc;
  });
  return ['date', 'Value'];
}

/**
 * Shapes data for a chart to display
 */
function shapeDataForChart(payload) {
  const {
    data,
    dates,
    mode,
  } = payload;

  // normalize data for charting
  const normalizedData = normalizeData(data, dates);

  // process raw symbols for portfolio values
  // processes normalizedData *in place*
  let columns = processPortfolios(normalizedData, payload);

  // sum our series into a single one if we're in summing mode
  if (mode === chartModes.SUM) {
    columns = applySummingMode(normalizedData);
  }

  return {
    shapedData: normalizedData.shapedData,
    columns,
  };
}

/**
 * Data processing toolchain
 */
self.onmessage = ({ data: action }) => { // `data` should be a FSA compliant action object.
  const toPost = action;
  delete toPost.meta; // get rid of meta so it doesn't infinite loop calling worker
  switch (action.type) {
    case ActionTypes.SHAPE_RESPONSE: {
      // by the time we get here we're sure we need to fetch the URLs
      // if not, it would have been cancelled by cache
      dispatch({
        type: ActionTypes.SET_CACHE,
        payload: {
          key: action.payload.url,
          value: shapeResponse(
            action.payload.body,
            action.payload.symbol
          ),
        },
      });
      dispatch({
        type: ActionTypes.START_CHART_UPDATE_FLOW,
      });
      break;
    }
    case ActionTypes.SHAPE_CHART_DATA: {
      dispatch({
        type: ActionTypes.STORE_CHART_DATA,
        payload: {
          id: action.payload.id,
          data: shapeDataForChart(action.payload),
        },
      });
      dispatch(setFetching(-1));
      break;
    }
    default:
      dispatch(toPost);
      break;
  }
};

/**
 * columns for quandl stocks:
 * 0: "Date"
  1: "Open"
  2: "High"
  3: "Low"
  4: "Close"
  5: "Volume"
  6: "Ex-Dividend"
  7: "Split Ratio"
  8: "Adj. Open"
  9: "Adj. High"
  10: "Adj. Low"
  11: "Adj. Close"
  12: "Adj. Volume"
 */

/**
 *[ {
  "date": "2007-01-03T05:00:00.000Z",
  "open": 29.91,
  "high": 30.25,
  "low": 29.4,
  "close": 29.86,
  "volume": 76935100,
  "SP500Close": 1416.6,
  "AAPLClose": 11.97,
  "GEClose": 37.97
} ]
columns: [
  "date",
  "open",
  "high",
  "low",
  "close",
  "volume",
  "SP500Close",
  "AAPLClose",
  "GEClose"
]


from quandl:
<cache>.dataset.data
 */

import formatDate from './formatDate';
import misc from '../constants/misc.json';
import symbolTypes from '../constants/symbolTypes.json';

/**
 * Build query string
 */
function encodeQueryData(data) {
  const ret = [];
  for (const d in data) {
    ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`);
  }
  return ret.join('&');
}

/**
 * Get Quandl database code of a symbol
 */
function getDatabaseCode(symbolParts) {
  switch (symbolParts.symbol) {
    // User input BTC or ETH
    case 'BTC':
    case 'ETH':
      return symbolParts.type === symbolTypes.USER_INPUT
        ? 'BITFINEX'
        : 'WIKI';
    // Yahoo! autocomplete BTC/USD symbol
    case 'BTCUSD=X':
    case 'BTC=X':
      return symbolParts.type === symbolTypes.CURRENCY
        ? 'BITFINEX'
        : 'WIKI';
    default:
      return 'WIKI';
  }
}

/**
 * Get Quandl Dataset code of a symbol
 */
function getDatasetCode(symbolParts) {
  switch (symbolParts.symbol) {
    // User input BTC or ETH
    case 'BTC':
    case 'ETH':
      return `${symbolParts.symbol}USD`;
    // Yahoo! autocomplete BTC/USD symbol
    case 'BTCUSD=X':
    case 'BTC=X':
      return 'BTCUSD';
    default:
      return symbolParts.symbol.toUpperCase();
  }
}

/**
 * Get YQL Query
 */
function getYQLQuery(symbol, startDate, endDate) {
  return 'select * from yahoo.finance.historicaldata where symbol = '
    + `"${symbol.toUpperCase()}" and startDate = "${startDate}" and endDate = "${endDate}"`;
}

/**
 * Builds a time-series request to Quandl for financial data (or other providers)
 */
export default function buildAPIRequest(dates, symbol, quandl) {
  const t = symbol.indexOf(misc.SYM_DELIMETER) > -1 ? symbol.split(misc.SYM_DELIMETER) : symbol;
  const symbolParts = {
    type: Array.isArray(t) ? t[0] : symbolTypes.USER_INPUT,
    symbol: Array.isArray(t) ? t[1] : symbol,
  };
  if (
    symbolParts.symbol === 'USD'
    && symbolParts.type === symbolTypes.USER_INPUT
  ) {
    return false; // cash gets processed without transformation
  }
  const firstDate = formatDate(new Date(dates[0]));
  const secondDate = formatDate(new Date(dates[1]));
  if (
    (
      symbolParts.type === symbolTypes.STOCK // allows equities to be entered
      || symbolParts.type === symbolTypes.CURRENCY // Allows input BTCUSD=X or BTC=X for bitcoin
      || symbolParts.type === symbolTypes.USER_INPUT // Allows input ETH/BTC ethereum/bitcoin
    )
    && typeof quandl === 'string' // make sure we have a decent API key
    && quandl.length > 2
  ) {
    const start = 'https://www.quandl.com/api/v3/datasets/'
      + `${getDatabaseCode(symbolParts)}/${getDatasetCode(symbolParts)}.json`;
    if (!dates[0]) {
      dates[0] = dates[1]; // eslint-disable-line no-param-reassign
    }
    if (!dates[1]) {
      return false;
    }
    const reqParams = {
      api_key: quandl,
      start_date: firstDate,
      end_date: secondDate,
      collapse: 'daily',
    };
    return `${start}?${encodeQueryData(reqParams)}`;
  }
  else { // symbolParts.type === symbolTypes.ETF.
    // Other non-user unknown types should be handled here as well since
    // those types spawn from Y! autocomplete in the first place
    const start = 'https://query.yahooapis.com/v1/public/yql';
    const reqParams = {
      format: 'json',
      env: 'store://datatables.org/alltableswithkeys',
      q: getYQLQuery(symbolParts.symbol, firstDate, secondDate),
      callback: '',
    };
    return `${start}?${encodeQueryData(reqParams)}`;
  }
}

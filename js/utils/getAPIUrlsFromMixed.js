import getSymbols from './getSymbols';
import buildAPIRequest from './buildAPIRequest';

/**
 * Gets all unique buildAPIRequest URLs from mixed type inputs
 */
export default function getAPIUrlsFromMixed(symbols, transactions, dates, apiKey) {
  const newSymbols = getSymbols(symbols, transactions);
  return newSymbols.map(symbol => ([buildAPIRequest(dates, symbol, apiKey), symbol]))
    .filter(req => req[0]); // get rid of erroring requests
}

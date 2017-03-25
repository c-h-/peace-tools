import symbolTypes from '../constants/symbolTypes.json';
import transStructure from '../constants/transactionStructure.json';
import {
  SYM_DELIMETER,
} from '../constants/misc.json';
import {
  defs,
} from '../constants/assetDefs.json';

const ASSET_DEFS = defs;

/**
 * Get unique values from array back
 */
function uniq(a) {
  const seen = {};
  return a.filter((item) => {
    return seen.hasOwnProperty(item) // eslint-disable-line no-prototype-builtins
      ? false
      : (seen[item] = true);
  });
}

/**
 * Flattens an array of symbols from mixed types to just basic symbols
 */
export default function getSymbols(symbols = [], transactions = []) {
  const newSymbols = [];
  for (const i in symbols) {
    const val = symbols[i].value ? symbols[i].value : symbols[i];
    if (
      val && val.indexOf(SYM_DELIMETER) > -1
    ) {
      // found a symbol delimeted by a type
      const t = val.split(SYM_DELIMETER);
      switch (t[0]) {
        case symbolTypes.PORTFOLIO: {
          const selectedTransactions = transactions.filter((trans) => {
            return trans[transStructure.PID] === parseInt(t[1], 10);
          });
          selectedTransactions.forEach((trans) => {
            if (newSymbols.indexOf(trans[transStructure.SYMBOL]) === -1) {
              // associate the user input transaction type to a symbol type
              const ticker = trans[transStructure.SYMBOL].toUpperCase();
              const matchedType = ASSET_DEFS.find(type => type.enum === trans[transStructure.TYPE]);
              const chosenType = matchedType
                ? (symbolTypes[matchedType.name.toUpperCase()] || symbolTypes.USER)
                : symbolTypes.USER;
              newSymbols.push(`${chosenType}${SYM_DELIMETER}${ticker}`);
            }
          });
          break;
        }
        default:
          newSymbols.push(val.toUpperCase());
          break;
      }
    }
    else {
      newSymbols.push(val.toUpperCase());
    }
  }
  return uniq(newSymbols);
}

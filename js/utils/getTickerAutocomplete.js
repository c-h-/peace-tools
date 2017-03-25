import jsonp from 'jsonp';

/**
 * Gets ticker data for input from Yahoo API
 * @param {String} input - the input query
 */
export default function getTickerAutocomplete(input = '') {
  return new Promise((resolve, reject) => {
    jsonp(`http://d.yimg.com/aq/autoc?query=${encodeURIComponent(input)}&region=US&lang=en-US`, {
      // prefix: 'YAHOO.util.ScriptNodeDataSource.callbacks',
    }, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

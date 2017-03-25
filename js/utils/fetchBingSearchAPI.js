import ActionTypes from '../redux/action_types.json';

/**
 * Gets Bing API results
 */
export default function fetchBingSearchAPI(dispatch, key, urls) {
  return new Promise((resolve, reject) => {
    if (!urls.length) {
      resolve();
    }
    const urlData = urls.pop();
    const symbol = urlData[0];
    const msftUrl = urlData[1];
    /**
     * Finishes a request
     * @param {*} data - the data to store
     * @param {*} symbol - the symbol the data relates to
     */
    function finish(data) {
      dispatch({
        type: ActionTypes.RECEIVE_HEADLINES,
        payload: {
          data: data || true,
          symbol,
        },
      });
      if (urls.length) { // iterate over next urls
        fetchBingSearchAPI(dispatch, key, urls).then(resolve, reject);
      }
      else {
        resolve();
      }
    }
    /**
     * Handles an error
     * @param {Object|String} err - the error that occurred
     */
    const errHandler = (err) => {
      dispatch({
        type: ActionTypes.ERROR,
        payload: {
          msg: err.toString(),
        },
      });
      finish(); // don't allow retries
    };
    fetch(msftUrl, {
      cors: true,
      headers: {
        'Ocp-Apim-Subscription-Key': key,
      },
    })
    .then((response) => {
      if (!response.ok) {
        errHandler(`Bing API Error ${response.status}`);
      }
      return response.json();
    })
    .then(
      data => finish(data),
      errHandler
    )
    .catch(errHandler);
  });
}

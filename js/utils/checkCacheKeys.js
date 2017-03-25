import hash from './fastHash';

/**
 * Compares two arrays of hashes and returns misses
 */
export default function checkCacheKeys(hashes, cacheDict) {
  return hashes.filter(key => cacheDict.indexOf(hash(key).toString()) === -1);
}

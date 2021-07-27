import { setup } from "axios-cache-adapter";

const defaultCacheOptions = {
  clearOnError: true,
  clearOnStale: true,
  // debug: true, // enable to read axios-cache-adapter logs
  exclude: { query: false },
  maxAge: 15 * 60 * 1000, // cache retention for query set 15min
};

const defaultAxiosOptions = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

/**
 * axios client config with axios-cache-adapter and localforage
 * @param {Object} options - config options for axios
 * @param {!String} options.method
 * @param {!String} options.url
 * @param {?(String|String[])} options.clearCacheEntryForQueriesQueries - api of queries that you wish to invalidate the cache for (use when UPDATE, POST or DELETE to invalidate cached GET queries for specified api endpoint)
 * @param {?Boolean} options.crossdomain
 * @param {?Boolean} options.excludeFromCache - exclude this query from being cached or not - true = excluded, false = cache it - defaults to true
 * @param {?Number} options.maxAge - max amount of time to store item in cache store (default is 15min (15 * 60 * 1000))
 * @param {?Object} options.data
 * @param {?Object} options.headers
 * @param {...any} options.rest - any other axios options
 */
const client = (options: any) => {
  const cache = {
    ...defaultCacheOptions,
    maxAge: options.maxAge || defaultCacheOptions.maxAge,
    excludeFromCache: options.excludeFromCache === false ? false : true, // default to exclude queries from the cache unless explicitly stated with options.excludeFromCache bool
  };

  const axiosConfig = { cache, ...defaultAxiosOptions, ...options };

  const axios = setup(axiosConfig);

  return axios(axiosConfig);
};

export default client;

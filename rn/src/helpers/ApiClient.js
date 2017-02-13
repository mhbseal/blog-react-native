import config  from '../config';

const methods = ['get', 'post', 'put', 'delete'];

// 调整path
function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  return config.apiServer + adjustedPath;
}

export default class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { params, data } = {}) => {
        if (params) {
          path = path + "?" +
            Object.keys(params)
              .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
              .join("&");
        }

        return fetch(formatUrl(path), {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(data)
        });
      }
    })
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
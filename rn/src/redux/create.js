import {
  Platform,
} from 'react-native';
import { createStore as _createStore, applyMiddleware } from 'redux';
import createClientMiddleware from './middleware/clientMiddleware';
import setTimeoutMiddleware from './middleware/setTimeoutMiddleware';
import reducer from './modules/navigator';
import { composeWithDevTools } from 'remote-redux-devtools';

export default function createStore(client, initialState) {
  const middleware = [createClientMiddleware(client), setTimeoutMiddleware];

  const composeEnhancers = composeWithDevTools({
    name: Platform.OS,
    host: 'localhost',
    port: 5678,
    realtime: true,
  });

  const store = _createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(...middleware)
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(() => {
      const nextRootReducer = require('./modules/navigator').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
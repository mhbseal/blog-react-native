import {
  Platform,
} from 'react-native';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createClientMiddleware from './middleware/clientMiddleware';
import setTimeoutMiddleware from './middleware/setTimeoutMiddleware';
import reducer from './modules/navigator';
import { composeWithDevTools } from 'remote-redux-devtools';

export default function createStore(client, initialState) {
  const middleware = [createClientMiddleware(client), setTimeoutMiddleware];

  // 安卓下native和rn之间多次跳转,remote-redux-devtools导致出现跳转的bug(v0.0.1 bug.2),这要看需要自行设置
  const composeEnhancers = __DEV__/* && Platform.OS !== 'android'*/ ? composeWithDevTools({
    name: Platform.OS,
    host: 'localhost',
    port: 5678,
    realtime: true,
  }) : compose;

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
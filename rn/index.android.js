/**
 * reactnative入口
 */

import './src/utils/global';
import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import { Provider } from 'react-redux';
import createStore from './src/redux/create';
import Navigator from './src/containers/Navigator';
import ApiClient from './src/helpers/ApiClient';
import { initialStates } from './src/redux/modules/reducers';
import { common as c } from 'mo2js';

const client = new ApiClient();

class ReactNative extends Component {
  constructor(props) {
    super(props);

    let FirstComponent = 'ArticleList';
    let params;

    if (props.route) {
      let route = JSON.parse(props.route)

      if (route && route.component) {
        FirstComponent = route.component;
        params = route.params;
      }
    }

    this.store = createStore(client, {
      index: 0,
      routes: [{
        index: 0,
        key: FirstComponent + '-0',
        component: FirstComponent,
        params,
        data: c.extend(true, {}, initialStates[FirstComponent])
      }]
    });
  }
  render() {
    return (
      <Provider store={this.store} >
        <Navigator />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ReactNative', () => ReactNative);
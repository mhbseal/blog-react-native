import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { Component, PropTypes } from 'react';
import constants from '../utils/constants';

import Mask from './Mask';

export default class Loading extends Component {
  render() {
    let {loading, msg} = this.props;

    if (loading) {
      return (
        <Mask containerStyle={styles.mask}>
          <View style={styles.loading}>
            <ActivityIndicator size='large' color='#428bca'/>
            <Text style={styles.loadingMsg}>{msg ? msg : '加载中...'}</Text>
          </View>
        </Mask>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  mask: {
    top: constants.headerHeight,
  },
  loading: {
    position: 'absolute',
    borderRadius: 7,
    backgroundColor: 'white',
    top: (constants.window.height - 100 - constants.headerHeight) / 2,
    left: (constants.window.width - 100) / 2,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMsg: {
    marginTop: 10,
    color: '#666',
  }
})
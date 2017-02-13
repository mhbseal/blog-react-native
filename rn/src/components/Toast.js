import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import React, { Component, PropTypes } from 'react';
import constants from '../utils/constants';

export default class Toast extends Component {
  render() {
    let {show, msg, style} = this.props;

    if (show && msg) {
      return (
        <View style={[styles.toast, style]}>
          <Text style={styles.toastMsg}>{msg}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    top: (constants.window.height + constants.headerHeight - 40) / 2,
    left: (constants.window.width - 200) / 2,
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastMsg: {
    color: '#fff',
  }
})
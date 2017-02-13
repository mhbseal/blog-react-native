import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import React, { Component, PropTypes } from 'react';

export default class Alert extends Component {
  render() {
    let {msg, style} = this.props;
    
    if (msg) {
      return (
        <View style={[styles.alert, style]}>
          <Text style={styles.alertMsg}>{msg}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  alert: {
    backgroundColor: '#fcf8e3',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#faf2cc',
    borderRadius: 4,
  },
  alertMsg: {
    color: '#c09853',
  }
})
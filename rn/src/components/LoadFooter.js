import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import React, { Component, PropTypes } from 'react';


export default class LoadFooter extends Component {
  render() {
    let { loading, loadingMsg, noMore, noMoreMsg, errorButton, errorButtonText, errorButtonOnPress, style } = this.props;
    let view = [];

    if (noMore) {
      view.push(
        <Text key={1} style={styles.footerTitle}>{noMoreMsg ? noMoreMsg : '没有更多了'}</Text>
      )
    }
    if (loading) {
      view.push(
        <ActivityIndicator style={styles.footerActivityIndicator} key={0} />,
        <Text key={1} style={styles.footerTitle}>{loadingMsg ? loadingMsg : '加载中...'}</Text>
      )
    }
    if (errorButton) {
      view.push(
        <TouchableOpacity
          key={1}
          onPress={errorButtonOnPress}
        >
          <Text style={styles.footerTitle}>{errorButtonText ? errorButtonText: '点击重试'}</Text>
        </TouchableOpacity>
      )
    }
    return view.length ?
      <View style={[styles.footer, style]}>
        {view}
      </View> : null;
  }
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  footerActivityIndicator: {
    marginRight: 10,
  },
  footerTitle: {
    color: 'gray'
  }
})
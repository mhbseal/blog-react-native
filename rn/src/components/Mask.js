import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import constants from '../utils/constants';


export default class Mask extends Component {
  render() {
    let { style, containerStyle, children, onPress} = this.props;
    return (
      <TouchableOpacity activeOpacity={1} style={[styles.container, containerStyle]} onPress={onPress}>
        <View style={[styles.mask, style]}></View>
        {children}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
  },
  mask: {
    height: constants.window.height,
    width: constants.window.width,
    opacity: 0.3,
    backgroundColor: 'black',
  }
})
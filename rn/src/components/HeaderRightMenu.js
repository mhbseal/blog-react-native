import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import constants from '../utils/constants';
import Mask from './Mask';

export default class HeaderRightMenu extends Component {
  render() {
    let { data, onPress, style } = this.props;
    let last = data.length - 1;

    return (
      <Mask style={{opacity: 0.05}} onPress={onPress}>
        <View style={[styles.headerRightMenu, style]}>
          <View style={styles.topArrow}></View>
          <View style={styles.buttonItems}>
            {data.map((v, i) => {
              return (
                <TouchableOpacity
                  key={`button-${i}`}
                  style={[styles.button, i === last ? styles.buttonNoBorder: null]}
                  onPress={() => { onPress(); v.action(v, i);}}
                >
                  {v.icon ? <Icon style={styles.icon} {...Object.assign({color: 'black', size: 18} , v.icon)}/> : null}
                  <Text style={styles.text}>{v.text}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </Mask>
    )
  }
}

const styles = StyleSheet.create({
  headerRightMenu: {
    position: 'absolute',
    top: constants.headerHeight + 7,
    right: 8,
  },
  topArrow: {
    position: 'absolute',
    top: -5,
    right: 10,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    overflow: 'hidden',
    borderTopWidth: 0,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
  },
  buttonItems: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  buttonNoBorder: {
    borderBottomWidth: null,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: '#428bca',
  },
})
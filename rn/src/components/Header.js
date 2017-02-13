import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pop } from '../redux/modules/navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { common as c } from 'mo2js';
import constants from '../utils/constants';

@connect(
  state => ({
    navigator: state
  }),
  { pop }
)
export default class Header extends Component {
  render() {
    let { pop, statusBar, left, renderLeftView, title, renderCenterView, right, renderRightView, renderHeaderView } = this.props;
    let leftItem = [], LeftIcon, LeftText, leftAction, centerItem = [], rightItem = [], RightButton, rightArray = [];
    let HeaderView, CenterView, LeftView, RightView;
    
    // 左边
    if (left !== null) {
      if (c.isObject(left)) {
        if (left.icon) {
          LeftIcon = <Icon style={styles.leftIcon} {...Object.assign({color: '#428bca', size: 23}, left.icon)}/>;
        }
        if (left.text) { // 如果有文字
          LeftText = <Text style={[styles.leftText, left.icon ? {marginLeft: 3} : null]}>{left.text}</Text>;
        }
        leftAction = left.action || pop;
      } else { // 默认左边为回退按钮,不带文字
        LeftIcon = <Icon style={styles.leftIcon} color="#428bca" size={30} name='angle-left'/>;
        leftAction = pop;
      }
      leftItem.push(
        <TouchableOpacity
          key='left'
          activeOpacity={0.75}
          onPress={leftAction}
          style={[styles.button, !LeftText  ? styles.leftOnlyIcon : null]}
        >
          {LeftIcon}
          {LeftText}
        </TouchableOpacity>
      )
    }
    // 标题
    if (title != null) {
      centerItem.push(
        <Text key='title' ellipsizeMode="tail" numberOfLines={1} style={styles.title}>{title}</Text>
      )
    }
    // 右边
    if (right != null) {
      if (!c.isArray(right)) {
        rightArray.push(right);
      } else {
        rightArray = right;
      }

      rightArray.forEach(function(v, i) {
        if (v.icon) {
          RightButton = <Icon style={styles.rightIcon} {...Object.assign({color: '#428bca', size: 23} , v.icon)}/>
        } else if (v.text) {
          RightButton = <Text style={styles.rightText}>{v.text}</Text>
        }
        if (RightButton) {
          rightItem.push(
            <TouchableOpacity
              key={`right-${i}`}
              activeOpacity={0.75}
              onPress={() => {v.action(v, i)}}
              style={styles.button}
            >
              {RightButton}
            </TouchableOpacity>
          )
        }
      });
    }

    // 整合view
    if (c.isFunction(renderHeaderView)) {
      HeaderView = renderHeaderView();
    } else {
      CenterView = c.isFunction(renderCenterView) ? renderCenterView() : <View style={styles.centerItem}>{centerItem}</View>;
      LeftView = c.isFunction(renderLeftView) ? renderLeftView() : <View style={styles.sideItem}>{leftItem}</View>;
      RightView = c.isFunction(renderRightView) ? renderRightView() : <View style={styles.sideItem}>{rightItem}</View>;
    }

    return (
      <View>
        <StatusBar {...statusBar}/>
        {statusBar && statusBar.hidden || Platform.OS === 'android' ? null : <View style={styles.statusBar} /> }
        <View style={styles.nav}>
          {HeaderView}
          {CenterView}
          {LeftView}
          {RightView}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: 20,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  leftIcon: {
    marginLeft: 8,
  },
  leftOnlyIcon: {
    paddingRight: 20,
  },
  leftText: {
    marginLeft: 8,
    fontSize: 14
  },
  title: {
    width: constants.window.width - 140,
    fontSize: 18,
    color: '#428bca',
    textAlign: 'center',
  },
  rightIcon: {
    marginRight: 8
  },
  rightText: {
    marginRight: 8,
    fontSize: 14
  }
})
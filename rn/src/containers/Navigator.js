import {
  NavigationExperimental,
  StyleSheet,
  BackAndroid,
  Platform,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pop } from '../redux/modules/navigator';

// 所有页面这里引入
import ArticleList from './ArticleList';
import Article from './Article';
import SinglePage from './SinglePage';
import Search from './Search';
import Others from './Others';

const { CardStack } = NavigationExperimental;


@connect(
  state => ({
    navigator: state
  }),
  { pop }
)
export default class Navigator extends Component {
  renderScene = (sceneProps) => {
    let { index, component, params } = sceneProps.scene.route;

    switch (component) {
      case 'ArticleList':
        return <ArticleList params={params} index={index} />;
      case 'Article':
        return <Article params={params} index={index} />;
      case 'SinglePage':
        return <SinglePage params={params} index={index} />;
      case 'Search':
        return <Search params={params} index={index} />;
      case 'Others':
        return <Others params={params} index={index} />;
      default:
        console.error('Not Found Container');
    }
  }
  render() {
    let { navigator, pop } = this.props;
    return (
      <CardStack
        onNavigateBack={pop}
        direction={ navigator.direction || navigator.routes[navigator.index].direction}
        navigationState={navigator}
        renderScene={this.renderScene}
        style={styles.navigator}
        enableGestures={false}
      />
    )
  }
  componentWillMount() {
    Platform.OS === 'android' && BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWIllUnmount() {
    Platform.OS === 'android' && BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  onBackAndroid = () => {
    let { navigator, pop } = this.props;

    if (navigator.routes.length) {
      pop();
      return true;
    }
    return false;
    // pop();
    // return true;
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
});
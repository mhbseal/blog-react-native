import {
  StyleSheet,
  View,
  WebView,
Text,
  InteractionManager,
} from 'react-native';
import React, { Component } from 'react';
import Header from '../components/Header';

export default class SinglePage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title={'网页'} />
        <WebView
          source={{uri:this.props.params.uri}}
          startInLoadingState={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
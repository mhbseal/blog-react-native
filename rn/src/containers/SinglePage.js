import {
  StyleSheet,
  Text,
  View,
  WebView,
  InteractionManager,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from '../redux/modules/navigator';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import LoadFooter from '../components/LoadFooter';
import htmlHelper from '../helpers/htmlHelper';
import { read } from '../redux/modules/singlePage';
import { objectPath } from 'mo2js';


@connect(
  (state, ownProps) => ({
    singlePage: objectPath.get(state.routes[ownProps.index], 'data'),
  }), {
    read,
    push
  }
)
export default class SinglePage extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return !!nextProps.singlePage;
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchSinglePage();
    })
  }
  render() {
    let {
      singlePage: {
        api: {
          singlePage: {
            reading,
            readData,
            readError,
            readToast
          }
        },
      },
    } = this.props;
    let content, title;

    if (readData) {
      content = readData.content;
      title = readData.title;
    }

    return (
      <View style={styles.container}>
        <Header title={title} />
        {content ?
          <WebView
            source={{html: htmlHelper(content, 1)}}
            onMessage={this.onMessage}
          />
          : null}
        <Loading loading={reading} />
        <Toast msg={readError} show={readToast} />
        <LoadFooter
          errorButton={readError}
          errorButtonOnPress={this.fetchSinglePage}
        />
      </View>
    );
  }
  fetchSinglePage = async ()  => {
    let {
      read,
      params
    } = this.props;

    await read({params});
  }
  onMessage = (e) => {
    this.props.push({
      component: 'Others',
      params: {
        uri: e.nativeEvent.data
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
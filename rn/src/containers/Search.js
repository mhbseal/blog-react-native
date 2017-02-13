import {
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  NativeModules,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push, pop } from '../redux/modules/navigator';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  apiLayoutRead,
  inputChangeText,
  inputClearText,
  setSearchHistory,
} from '../redux/modules/search';
import constants from '../utils/constants';
import { objectPath, es5, common as c } from 'mo2js';

@connect(
  (state, ownProps) => ({
    search: objectPath.get(state.routes[ownProps.index], 'data')
  }), {
    apiLayoutRead,
    inputChangeText,
    inputClearText,
    setSearchHistory,
    push,
    pop,
  }
)
export default class Search extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return !!nextProps.search;
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      let {
        apiLayoutRead,
        setSearchHistory,
      } = this.props;

      this.input.focus();
      storage.load({
        key: 'search'
      }).then(ret => {
        if (!c.isArray(ret)) {
          ret = [];
        }
        setSearchHistory(ret);
      }).catch(err => {
        if (err.name === 'NotFoundError') {
          setSearchHistory([]);
        }
      });
      apiLayoutRead();
    })
  }
  render() {
    let {
      search: {
        api: {
          layout: {
            readData
          }
        },
        form: {
          search: {
            content
          }
        },
        searchHistory
      },
    } = this.props;
    let SearchHistory;

    if (searchHistory && searchHistory.length) {
      SearchHistory = (
        <View style={styles.box}>
          <Text style={styles.title}>搜索历史</Text>
          <View style={styles.buttonBox}>
            {searchHistory.slice(0, 10).map((v, i) => {
              return (
                <TouchableOpacity
                  onPress={this.searchHistoryHandle.bind(this, v)}
                  key={i}
                  style={styles.historyButton}
                >
                  <Text>{v}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Header ref="header" renderHeaderView={this.renderHeaderView.bind(this, content)}  />
        <ScrollView>
          {SearchHistory}
          <View style={styles.box}>
            <Text style={styles.title}>标签云</Text>
            <View style={styles.buttonBox}>
              {readData && readData.articleTags.map((v, i) => {
                return (
                  <TouchableOpacity
                    onPress={this.articleTagsHandle.bind(this, v)}
                    key={i}
                    style={styles.historyButton}
                  >
                    <Text>{v.name}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  renderHeaderView(content) {
    return ([
      <Icon key="icon" style={styles.icon} name="search" />,
      <TextInput
        ref={(ref) => this.input = ref}
        underlineColorAndroid="transparent"
        key="input"
        placeholder="请输入关键字"
        style={styles.input}
        value={content}
        onChangeText={this.onChangeText.bind(this, 'content')}
        onSubmitEditing={this.searchHandle}
      />,
      <TouchableOpacity
        key="cancel"
        onPress={this.handleCancel}
        style={styles.cancel}
      >
        <Text>取消</Text>
      </TouchableOpacity>
    ])
  }
  onChangeText(key, value) {
    this.props.inputChangeText(key, value);
  }
  handleCancel = () => {
    this.props.pop();
  }
  goToArticleList(params) {
    this.props.push({
      component: 'ArticleList',
      params
    });
    // 测试原生和rn之间跳转-IOS
    // NativeModules.Navigator.push({
    //   component: 'IosNativeViewController',
    //   params
    // });
    // // 测试原生和rn之间跳转-ANDROID
    // NativeModules.Navigator.push({
    //   component: 'com.mhbseal.blog.MainActivity',
    //   params: JSON.stringify(params)
    // });
  }
  searchHandle = () => {
    let {
      search: {
        form: {
          search: {
            content
          }
        },
        searchHistory
      }
    } = this.props;

    if (content == null || content === '') return;

    if (searchHistory) {
      let isHas = es5.some(searchHistory, function(v) {
        return v === content;
      });

      if (!isHas) {
        let newSearchHistory = searchHistory.slice(0, 99);
        newSearchHistory.unshift(content);
        storage.save({
          key: 'search',
          rawData: newSearchHistory
        })
      }
    }

    this.goToArticleList({
      keyword: content
    });
  }
  searchHistoryHandle(content) {
    this.props.inputChangeText('content', content);
    this.goToArticleList({
      keyword: content
    });
  }
  articleTagsHandle(tag) {
    this.goToArticleList({
      tag
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  icon: {
    position: 'absolute',
    left: 20,
    top: 15,
    zIndex: 1,
    backgroundColor: '#e3e3e5',
    color: "#333",
  },
  input: {
    marginTop: Platform.OS === 'ios' ? 7 : 0,
    marginLeft: 10,
    width: constants.window.width - 60,
    height: 30,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 25,
    borderRadius: 3,
    fontSize: 14,
    backgroundColor: '#e3e3e5',
  },
  cancel: {
    width: 50,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    flexWrap: 'wrap',
    marginTop: 20,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  historyButton: {
    borderRadius: 3,
    backgroundColor: '#efefef',
    marginTop: 10,
    marginRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  }
});
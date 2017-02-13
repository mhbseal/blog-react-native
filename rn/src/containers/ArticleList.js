import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListView,
  RefreshControl,
  InteractionManager,
  Image,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from '../redux/modules/navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import HeaderRightMenu from '../components/HeaderRightMenu';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import LoadFooter from '../components/LoadFooter';
import {
  apiArticleListRead,
  apiLayoutRead,
  apiArticleStarCreate,
  toggleHeaderRightMenu,
  changleTitle
} from '../redux/modules/articleList';
import { objectPath } from 'mo2js';
import utils from '../utils/utils';
import constants from '../utils/constants';

@connect(
  (state, ownProps) => ({
    articleList: objectPath.get(state.routes[ownProps.index], 'data')
  }), {
    push,
    apiArticleListRead,
    apiLayoutRead,
    apiArticleStarCreate,
    toggleHeaderRightMenu,
    changleTitle
  }
)
export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.listViewDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.fetchType = 2; // 0上拉加载更多/1下拉刷新/2初次加载
    this.typePath = null;
    this.tagPath = null;
    this.keyword = null;
    this.headerRightMenuData = [{
      text: '主页',
      action: this.homeHandle
    }, {
      text: 'API',
      action: () => {
        props.push({
          component: 'SinglePage',
          params: {
            path: 'api'
          }
        });
      }
    }, {
      text: '关于',
      action: () => {
        props.push({
          component: 'SinglePage',
          params: {
            path: 'about'
          }
        });
      }
    }];
  }
  shouldComponentUpdate(nextProps) {
    return !!nextProps.articleList;
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      let { params } = this.props;

      if (!params) params = {};

      let {
        type,
        tag,
        keyword
      } = params;

      this.fetchLayout();

      if (type) {
        this.typeHandle(type);
      } else if (tag) {
        this.tagHandle(tag);
      } else if (keyword != null) {
        this.keywordHandle(keyword);
      } else {
        this.homeHandle();
      }
    })
  }
  render() {
    let {
      articleList: {
        api: {
          articleList: {
            reading,
            readError,
            readToast
          }
        },
        articles,
        showHeaderRightMenu,
        title
      },
      toggleHeaderRightMenu,
      index
    } = this.props;

    return (
      <View style={styles.container}>
        <Header
          left={index == 0 && null}
          title={title}
          right={index == 0 ? [{
            icon: {
              name: 'search'
            },
            action: this.goToSearch
          }, {
            icon: {
              name: 'navicon'
            },
            action: toggleHeaderRightMenu,
          }] : null}
        />
        <ListView
          ref={'listview'}
          dataSource={this.listViewDS.cloneWithRows(articles)}
          renderRow={this.renderRow}
          onEndReached={this.onEndReached}
          refreshControl={
           <RefreshControl
              refreshing={this.fetchType === 1 &&!!reading}
              onRefresh={this.onRefresh}
              tintColor="#428bca"
              title="加载中..."
              titleColor="#666"
            />
          }
          renderFooter={this.renderFooter}
          enableEmptySections={true}
        />
        {showHeaderRightMenu ?
          <HeaderRightMenu
            style={styles.headerRightMenu}
            data={this.headerRightMenuData}
            onPress={toggleHeaderRightMenu}
          /> : null
        }
        <Loading loading={reading && this.fetchType === 2} />
        <Toast msg={readError} show={readToast} />
      </View>
    );
  }
  renderFooter = () => {
    let {
      articleList: {
        api: {
          articleList: {
            reading,
            readError
          }
        },
        pageList: {
          pageCount,
          current
        }
      }
    } = this.props;

    return (
      <LoadFooter
        loading={reading && this.fetchType === 0}
        noMore={!!(current >= pageCount)}
        errorButton={readError &&  this.fetchType !== 1}
        errorButtonOnPress={() => this.fetchArticleList(this.fetchType)}
      />
    )
  }
  onEndReached = () => {
    this.props.articleList.pageList.current && this.fetchArticleList(0);
  }
  onRefresh = () => {
    this.fetchArticleList(1);
  }
  renderRow = (rowData, sectionID, rowID) => {
    let introduction = this.getIntroduction(rowData.introduction);

    return (
      <TouchableOpacity
        onPress={this.goToArticle.bind(this, rowData._id)}
        style={styles.excerpt}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{rowData.title}</Text>
          <View style={styles.headerIcons}>
            <Icon color="#333" name="user" /><Text style={styles.headerText}>{rowData.author}</Text>
            <Icon color="#333" name="clock-o" /><Text style={styles.headerText}>{rowData.createTime.slice(0, 10)}</Text>
            <Icon color="#333" name="eye" /><Text style={styles.headerText}>{rowData.visits}</Text>
            <TouchableOpacity
              onPress={this.handleStar.bind(this, rowData._id, rowID)}
              style={styles.star}
            >
              <Icon color="#333" name="thumbs-up" />
              <Text style={styles.headerText}>{rowData.stars}</Text>
            </TouchableOpacity>
            <Icon color="#333" name="comments" /><Text style={styles.headerText}>{rowData.commentCount}</Text>
          </View>
        </View>
        {introduction.imgWidth ? <Image
          source={{
              uri: introduction.imgSrc,
            }}
          style={{
              width: introduction.imgWidth,
              height: introduction.imgHeight,
            }}
        /> : null}
        <Text style={styles.info}>{introduction.text}</Text>
        <View style={styles.footer}>
          <Icon style={styles.footerIcon} color="#666" name="tags" />
          {rowData.tags.map((tag, i) => {
            return (
              <TouchableOpacity
                onPress={this.tagHandle.bind(this, tag)}
                key={i}
              >
                <Text style={styles.footerText}>{(i ? ' ' : '') + tag.name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </TouchableOpacity>
    );
  }
  getIntroduction(introduction) {
    let img, imgSrc, imgSize, imgWidth, imgHeight;
    if (img = introduction.match(/<img.*?src=\"(.*?)\"/)) {
      imgSrc = img[1];
      imgSize = imgSrc.match(/\[(\d+)\*(\d+)\]/);
      if (imgSize) {
        imgWidth = constants.window.width - 20;
        imgHeight = imgWidth * imgSize[2] / imgSize[1];
      }
    }

    let text = utils.unescape(introduction.replace(/(\s*)<[^>]+>(\s*)/g,""));

    return {
      imgSrc,
      imgWidth,
      imgHeight,
      text
    }
  }
  fetchArticleList = async (fetchType, params = {})  => {
    let {
      articleList: {
        api: {
          articleList: {
            reading
          }
        },
        pageList: {
          pageCount,
          current
        }
      },
      apiArticleListRead
    } = this.props;

    if (reading || current >= pageCount && fetchType === 0) return;

    this.fetchType = fetchType;
    params.page = fetchType === 0 ? (current || 0) + 1 : 1;

    if (params.typePath == null) {
      if (params.typePath === null) {
        delete params.typePath;
      } else if (this.typePath) {
        params.typePath = this.typePath;
      }
    };

    if (params.tagPath == null) {
      if (params.tagPath === null) {
        delete params.tagPath;
      } else if (this.tagPath) {
        params.tagPath = this.tagPath;
      }
    };

    if (params.keyword == null) {
      if (params.keyword === null) {
        delete params.keyword;
      } else if (this.keyword) {
        params.keyword = this.keyword;
      }
    }

    await apiArticleListRead({params}, {fetchType});

    if (fetchType === 2) this.refs.listview.scrollTo({y: 0, animated: false});
  }
  fetchLayout = async () => {
    let {
      articleList: {
        api
      },
      apiLayoutRead
    } = this.props;

    await apiLayoutRead();

    let {
      layout: {
        readData
      }
    } = api;

    if (readData) {
      readData.articleTypes.forEach((articleType, i) => {
        this.headerRightMenuData.splice(1 + i, 0, {
          text: articleType.name,
          action: this.typeHandle.bind(this, articleType)
        });
      })
    }
  }
  goToArticle = (id) => {
    this.props.push({
      component: 'Article',
      params: {
        id
      }
    });
  }
  goToSearch = () => {
    this.props.push({
      component: 'Search'
    });
  }
  homeHandle = async () => {
    await this.fetchArticleList(2, {
      typePath: null,
      tagPath: null,
      keyword: null,
    });
    this.typePath = null;
    this.tagPath = null;
    this.keyword = null;
    this.props.changleTitle('主页');
  }
  typeHandle = async (type) => {
    await this.fetchArticleList(2, {
      typePath: type.path,
      tagPath: null,
      keyword: null,
    });
    this.typePath = type.path;
    this.tagPath = null;
    this.keyword = null;
    this.props.changleTitle(type.name);
  }
  tagHandle = async (tag) => {
    await this.fetchArticleList(2, {
      tagPath: tag.path,
      typePath: null,
      keyword: null,
    });
    this.tagPath = tag.path;
    this.typePath = null;
    this.keyword = null;
    this.props.changleTitle(tag.name);
  }
  keywordHandle = async (keyword) => {
    await this.fetchArticleList(2, {
      keyword: keyword,
      tagPath: null,
      typePath: null,
    });
    this.keyword = keyword;
    this.tagPath = null;
    this.typePath = null;
    this.props.changleTitle(keyword);
  }
  handleStar(id, i) {
    this.props.apiArticleStarCreate({params: {id}}, {i});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  excerpt: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    flex: 1,
    marginBottom: 10,
  },
  title: {
    lineHeight: 20,
    marginBottom: 7,
    fontSize: 18,
    color: '#428bca',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 6,
    marginRight: 10,
  },
  star: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginBottom: 10,
    lineHeight: 25,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  footerIcon: {
    marginRight: 5,
  },
  footerText: {
    color: '#428bca',
  },
  headerRightMenu: {
    width: 80
  }
});
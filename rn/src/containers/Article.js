import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  WebView,
  InteractionManager,
  TextInput,
  Image,
  TouchableHighlight
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import formVerification from '../utils/formVerification';
import { push } from '../redux/modules/navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import Alert from '../components/Alert';
import LoadFooter from '../components/LoadFooter';
import htmlHelper from '../helpers/htmlHelper';
import {
  apiArticleRead,
  apiArticleStarCreate,
  apiCommentCreate,
  changeWebViewHeight,
  changeVerificationMsg,
  inputChangeText,
  inputClearText
} from '../redux/modules/article';
import { objectPath } from 'mo2js';

@connect(
  (state, ownProps) => ({
    article: objectPath.get(state.routes[ownProps.index], 'data'),
  }), {
    apiArticleRead,
    apiArticleStarCreate,
    apiCommentCreate,
    changeWebViewHeight,
    changeVerificationMsg,
    inputChangeText,
    inputClearText,
    push,
  }
)
export default class Article extends Component {
  constructor(props) {
    super(props);
    this.webViewHeight = 0;
  }
  shouldComponentUpdate(nextProps) {
    return !!nextProps.article;
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchArticle();
    })
  }
  render() {
    let {
      article: {
        api: {
          article: {
            reading,
            readData,
            readError,
            readToast
          },
          comment: {
            editing,
            editError,
            editToast
          }
        },
        verificationMsg,
        form: {
          comment: {
            name,
            email,
            content
          }
        }
      },
    } = this.props;
    let detail;

    if (readData) {
      let { article, comments } = readData;

      detail =
        <ScrollView style={styles.detail}>
          <View style={styles.header}>
            <Text style={styles.title}>{article.title}</Text>
            <View style={styles.headerIcons}>
              <Icon color="#333" name="user" /><Text style={styles.headerText}>{article.author}</Text>
              <Icon color="#333" name="clock-o" /><Text style={styles.headerText}>{article.createTime.slice(0, 10)}</Text>
              <Icon color="#333" name="eye" /><Text style={styles.headerText}>{article.visits}</Text>
              <TouchableOpacity
                onPress={this.handleStar.bind(this, article._id)}
                style={styles.star}
              >
                <Icon color="#333" name="thumbs-up" />
                <Text style={styles.headerText}>{article.stars}</Text>
              </TouchableOpacity>
              <Icon color="#333" name="comments" /><Text style={styles.headerText}>{comments.length}</Text>
            </View>
          </View>
          <WebView
            style={[styles.info, {height:this.webViewHeight}]}
            source={{html: htmlHelper(article.content, 0)}}
            onNavigationStateChange={this.onNavigationStateChange}
            onMessage={this.onMessage}
          />
          <View style={styles.footer}>
            <Icon style={styles.footerIcon} color="#666" name="tags" />
            {article.tags.map((tag, i) => {
              return (
                <TouchableOpacity
                  onPress={this.goToArticleList.bind(this, tag)}
                  key={i}
                >
                  <Text style={styles.footerText}>{(i ? ' ' : '') + tag.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={styles.comment}>
            {comments.length ? <Text style={styles.commentTitle}>留言列表</Text> : null}
            {comments.map((comment, i) => {
              return (
                <View style={styles.commentListLi} key={i}>
                  <View style={styles.commentListInfo}>
                    <Image style={styles.commentListLeft} source={{uri: comment.user && comment.user.img || comment.admin && comment.admin.img}}/>
                    <View>
                      <Text style={styles.commentListRightText}>{comment.user && comment.user.name || comment.admin && comment.admin.name}</Text>
                      <Text>{comment.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.commentListContent}>{comment.content}</Text>
                  <TouchableOpacity onPress={this.handleReply.bind(this, comment.user && comment.user.name || comment.admin && comment.admin.name)}>
                    <Text style={styles.commentListReply}>回复</Text>
                  </TouchableOpacity>
                </View>
              )
            })}
            <Text style={styles.commentTitle}>发表评论</Text>
            <View style={styles.commentFormLi}>
              <Text>昵称：</Text>
              <TextInput underlineColorAndroid="transparent" value={name} style={styles.input} onChangeText={this.onChangeText.bind(this, 'name')} />
            </View>
            <View style={styles.commentFormLi}>
              <Text>邮箱：</Text>
              <TextInput underlineColorAndroid="transparent" value={email} style={styles.input} onChangeText={this.onChangeText.bind(this, 'email')} />
            </View>
            <View style={styles.commentFormLi}>
              <Text>内容：</Text>
              <TextInput underlineColorAndroid="transparent" ref="content" value={content} multiline={true} numberOfLines={4} style={[styles.input, styles.textarea]} onChangeText={this.onChangeText.bind(this, 'content')}/>
            </View>
            <View style={styles.commentFormLi}>
              <TouchableHighlight
                onPress={this.handleSubmit.bind(this, article._id)}
                style={styles.button}
                underlayColor={'#EBEBEB'}
              >
                <Text style={styles.buttonText}>发表评论</Text>
              </TouchableHighlight>
              <Alert msg={verificationMsg} style={styles.alert} />
            </View>
          </View>
        </ScrollView>
    }

    return (
      <View style={styles.container}>
        <Header title={'详情'} />
        {detail}
        <Loading loading={reading || editing} />
        <Toast msg={readError || editError} show={readToast || editToast} />
        <LoadFooter
          errorButton={readError}
          errorButtonOnPress={this.fetchArticle}
        />
      </View>
    );
  }
  goToArticleList(tag) {
    this.props.push({
      component: 'ArticleList',
      params: {
        tag
      }
    });
  }
  onMessage = (e) => {
    this.props.push({
      component: 'Others',
      params: {
        uri: e.nativeEvent.data
      }
    });
  }
  onChangeText(key, value) {
    this.props.inputChangeText(key, value);
  }
  onNavigationStateChange = (navState) => {
    navState.title && this.props.changeWebViewHeight(this.webViewHeight = +navState.title);
  }
  fetchArticle = async ()  => {
    let {
      apiArticleRead,
      params
    } = this.props;

    await apiArticleRead({params});
  }
  async handleSubmit (articleId) {
    let {
      article: {
        form: {
          comment
        }
      },
      apiCommentCreate,
      changeVerificationMsg,
      inputClearText
    } = this.props;

    let msg = formVerification(comment, {
      name: {
        rules: ['isRequired'],
        msgs: ['昵称不能为空！']
      },
      email: {
        rules: ['isRequired', 'isEmail'],
        msgs: ['邮箱不能为空！', '邮箱格式不正确！']
      },
      content: {
        rules: ['isRequired'],
        msgs: ['内容不能为空！']
      }
    });
    
    changeVerificationMsg(msg);

    if (msg) return;

    await apiCommentCreate({ data: {...comment, articleId} });
    inputClearText('content');
  }
  handleReply(name) {
    this.refs.content.focus();
    this.props.inputChangeText('content', `@${name} - `);
  }
  handleStar(id) {
    this.props.apiArticleStarCreate({params: {id}});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  detail: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    lineHeight: 20,
    marginBottom: 7,
    fontSize: 18
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
  comment: {
    marginTop: 30,
  },
  commentTitle: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 17,
  },
  commentListLi: {
    marginBottom: 15,
  },
  commentListInfo: {
    flexDirection: 'row',
  },
  commentListRightText: {
    marginTop: 5,
    marginBottom: 5,
  },
  commentListLeft: {
    width: 44,
    height: 44,
    marginRight: 15,
    marginBottom: 15,
  },
  commentListContent: {
    lineHeight: 21,
  },
  commentListReply: {
    marginTop: 3,
    marginBottom: 5,
    color: '#428bca',
  },
  commentFormLi: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    marginLeft: 10,
    width: 160,
    height: 30,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    fontSize: 14,
  },
  textarea: {
    flex: 1,
    height: 86,
    textAlignVertical: 'top',
  },
  button: {
    marginLeft: 53,
    justifyContent: 'center',
    height: 30,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
  },
  buttonText: {
    color: '#428bca',
  },
  alert: {
    marginLeft: 5,
  }
});
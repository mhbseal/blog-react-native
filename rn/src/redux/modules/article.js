import CURDcreater from '../../helpers/CURDcreater';

const pageName = 'article';
const CHANGE_WEBVIEW_HEIGHT = `${pageName}/CHANGE_WEBVIEW_HEIGHT`;
const CHANGE_VERIFICATION_MSG = `${pageName}/CHANGE_VERIFICATION_MSG`;
const INPUT_CHANGE_TEXT = `${pageName}/INPUT_CHANGE_TEXT`;
const INPUT_CLEAR_TEXT = `${pageName}/INPUT_CLEAR_TEXT`;

const initialState = {
  api: {
    article: {},
    articleStar: {},
    comment: {}
  },
  webViewHeight: 0,
  verificationMsg: '',
  form: {
    comment: {}
  }
};

const { methods: { read: apiArticleRead }, reducerCreater: apiArticleReducerCreater } = CURDcreater(pageName, 'article', 'R');
const { methods: { create: apiArticleStarCreate }, reducerCreater: apiArticleStarReducerCreater } = CURDcreater(pageName, 'articleStar', 'C');
const { methods: { create: apiCommentCreate }, reducerCreater: apiCommentReducerCreater } = CURDcreater(pageName, 'comment', 'C');

export default function reducer(state, action) {
  let result = {...state};

  switch (action.type) {
    case CHANGE_WEBVIEW_HEIGHT:
      result.webViewHeight = action.height;
      return result;
    case CHANGE_VERIFICATION_MSG:
      result.verificationMsg = action.msg;
      return result;
    case INPUT_CHANGE_TEXT:
      result.form.comment[action.key] = action.value;
      return result;
    case INPUT_CLEAR_TEXT:
      result.form.comment[action.key] = null;
      return result;
  }

  // 接口
  let apiArticleReducer = apiArticleReducerCreater(state, action, {
    read: (result) => {
      let commenter = action.data.commenter;
      if (commenter) {
        result.form.comment.name = commenter.name;
        result.form.comment.email = commenter.email;
      }
    }
  });
  let apiArticleStarReducer = apiArticleStarReducerCreater(state, action, {
    create: (result) => {
      result.api.article.readData.article.stars++;
    }
  });
  let apiCommentReducer = apiCommentReducerCreater(state, action, {
    create: (result) => {
      result.api.article.readData.comments.unshift(action.data);
    }
  });

  return apiArticleReducer || apiArticleStarReducer || apiCommentReducer || state;
}

export { initialState, apiArticleRead, apiArticleStarCreate, apiCommentCreate }

// webview高度自动适应
export function changeWebViewHeight(height) {
  return {
    type: CHANGE_WEBVIEW_HEIGHT,
    height
  };
}

export function changeVerificationMsg(msg) {
  return {
    type: CHANGE_VERIFICATION_MSG,
    msg
  };
}

export function inputChangeText(key, value) {
  return {
    type: INPUT_CHANGE_TEXT,
    key,
    value
  };
}

export function inputClearText(key) {
  return {
    type: INPUT_CLEAR_TEXT,
    key
  };
}
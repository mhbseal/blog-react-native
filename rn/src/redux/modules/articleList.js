import CURDcreater from '../../helpers/CURDcreater';

const pageName = 'articleList';
const TOGGLE_HEADERRIGHTMENU = `${pageName}/TOGGLE_HEADERRIGHTMENU`;
const CHANGE_TITLE = `${pageName}/CHANGE_TITLE`;

const { methods: { read: apiArticleListRead }, reducerCreater: apiArticleListReducerCreater } = CURDcreater(pageName, 'articleList', 'R');
const { methods: { read: apiLayoutRead }, reducerCreater: apiLayoutReducerCreater } = CURDcreater(pageName, 'layout', 'R');
const { methods: { create: apiArticleStarCreate }, reducerCreater: apiArticleStarReducerCreater } = CURDcreater(pageName, 'articleStar', 'C');

const initialState = {
  api: {
    layout: {},
    articleList: {},
    articleStar: {}
  },
  articles: [],
  pageList: {},
  showHeaderRightMenu: false,
  title: ''
};

export default function reducer(state, action) {
  let result = {...state};

  switch (action.type) {
    case TOGGLE_HEADERRIGHTMENU:
      result.showHeaderRightMenu = !result.showHeaderRightMenu;
      return result;
    case CHANGE_TITLE:
      result.title = action.title;
      return result;
  }

  // 接口
  let apiArticleListReducer = apiArticleListReducerCreater(state, action, {
    read: (result) => {
      result.articles = action.others.fetchType !== 0 ? action.data.articles : result.articles.concat(action.data.articles);
      result.pageList = action.data.pageList
    }
  });
  let apiLayoutReducer = apiLayoutReducerCreater(state, action);
  let apiArticleStarReducer = apiArticleStarReducerCreater(state, action, {
    create: (result) => {
      result.articles[action.others.i].stars++;
    }
  });

  return apiArticleListReducer || apiLayoutReducer || apiArticleStarReducer || state;
}

export { initialState, apiArticleListRead, apiLayoutRead, apiArticleStarCreate }

// 切换右侧菜单栏
export function toggleHeaderRightMenu() {
  return {
    type: TOGGLE_HEADERRIGHTMENU
  };
}
// 切换articleList时改变title
export function changleTitle(title) {
  return {
    type: CHANGE_TITLE,
    title
  };
}
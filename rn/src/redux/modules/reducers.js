import articleList, { initialState as articleListInitialState } from './articleList';
import article, { initialState as articleInitialState } from './article';
import singlePage, { initialState as singlePageInitialState } from './singlePage';
import search, { initialState as searchInitialState } from './search';

const reducers = {
  articleList,
  article,
  singlePage,
  search,
}

const initialStates = {
  ArticleList: articleListInitialState,
  Article: articleInitialState,
  SinglePage: singlePageInitialState,
  Search: searchInitialState,
}

export {
  reducers,
  initialStates
}
import CURDcreater from '../../helpers/CURDcreater';

const pageName = 'search';
const INPUT_CHANGE_TEXT = `${pageName}/INPUT_CHANGE_TEXT`;
const INPUT_CLEAR_TEXT = `${pageName}/INPUT_CLEAR_TEXT`;
const SET_SEARCH_HISTORY = `${pageName}/SET_SEARCH_HISTORY`;

const { methods: { read: apiLayoutRead }, reducerCreater: apiLayoutReducerCreater } = CURDcreater(pageName, 'layout', 'R');

const initialState = {
  api: {
    layout: {}
  },
  form: {
    search: {}
  },
  searchHistory: null
};

export default function reducer(state, action) {
  let result = {...state};

  switch (action.type) {
    case INPUT_CHANGE_TEXT:
      result.form.search[action.key] = action.value;
      return result;
    case INPUT_CLEAR_TEXT:
      result.form.search[action.key] = null;
      return result;
    case SET_SEARCH_HISTORY:
      result.searchHistory = action.data;
      return result;
  }

  let apiLayoutReducer = apiLayoutReducerCreater(state, action);

  return apiLayoutReducer || state;
}

export { initialState, apiLayoutRead }

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

export function setSearchHistory(data) {
  return {
    type: SET_SEARCH_HISTORY,
    data
  };
}
import CURDcreater from '../../helpers/CURDcreater';

const pageName = 'singlePage';

const initialState = {
  api: {
    singlePage: {}
  }
};

const { methods: { read }, reducerCreater } = CURDcreater(pageName, 'singlePage', 'R');

export default function reducer(state, action) {
  return reducerCreater(state, action) || state;
}

export { initialState, read }
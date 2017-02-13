import {
  NavigationExperimental,
  NativeModules,
} from 'react-native';
import { es5, common as c } from 'mo2js';
import { reducers, initialStates } from './reducers';

const { StateUtils } = NavigationExperimental;
const PUSH = 'navigator/push';
const POP = 'navigator/pop';

export default function reducer(state, action) {
  let result = {...state};
  let notChanged = true;
  switch (action.type) {
    case PUSH:
      delete result.direction;
      c.extend(true, action.route, {
        index: result.index + 1,
        key: action.route.component + '-' + (result.index + 1),
        data: initialStates[action.route.component],
      })
      return StateUtils.push(result, action.route);
    case POP:
      result.direction = result.routes[result.index].direction;
      !state.index && NativeModules.Navigator.pop();
      return StateUtils.pop(result);
  };

  // page页面reducer
  state && es5.each(reducers, function (reducer) {
    let previousState = state.routes[state.index].data;
    let nextState = reducer(previousState, action);

    if (nextState !== previousState) {
      result.routes[result.index].data = nextState;
      return notChanged = false;
    }
  });

  return notChanged ? state : result;
}

export function push(route) {
  return {
    type: PUSH,
    route
  };
}

export function pop() {
  return {
    type: POP
  };
}
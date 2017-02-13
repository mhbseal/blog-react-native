export default ({dispatch, getState}) => {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    let { setTimeout: isSetTimeout, timer, duration, types, ...rest } = action; // eslint-disable-line no-redeclare
    if (!isSetTimeout) {
      return next(action);
    }

    const [START, END] = types;
    next({...rest, type: START});

    clearTimeout(timer);
    timer = setTimeout(() => {
      next({...rest, type: END});
    }, duration);
  };
};
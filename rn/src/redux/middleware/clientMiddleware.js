export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      let { api, types, timer, ...rest } = action; // eslint-disable-line no-redeclare
      if (!api) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE, TOAST_CLEAR] = types;
      next({...rest, type: REQUEST});

      const actionPromise = api(client);
      const errorHandler = (error) => {
        next({...rest, error, type: FAILURE});
        clearTimeout(timer);
        timer = setTimeout(() => {
          next({...rest, error, type: TOAST_CLEAR});
        }, 1500);
      }

      return actionPromise
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.warn('SERVER ERROR:', {
              status: response.status,
              statusText: response.statusText
            });
            errorHandler('网络错误，请稍后重试...');
          }
        }).then((data) => {
          if (data.status.code === 0) {
            next({...rest, data: data.data, type: SUCCESS});
            return data.data;
          } else {
            errorHandler(data.status.msg);
          }
        }).catch((error)=> {
          console.warn('FETCH ERROR:', error);
          errorHandler('程序错误...');
        });
    };
  };
}
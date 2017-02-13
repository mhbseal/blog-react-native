import { objectPath } from 'mo2js';

function menthodCreater(method, types, pathName) {
  let timer;
  return function({ params, data } = {}, others = {}) {
    return {
      types,
      api: (client) => client[method](pathName, { params, data }),
      others,
      timer
    };
  }
}

function menthodsAndConstantsCreater(pathName, actions, action, constants, methods, name, pageName) {
  if (~actions.indexOf(action)) {
    let types = [
      `${pageName}/-api/${pathName}-/${name}`,
      `${pageName}/-api/${pathName}-/${name}_SUCCESS`,
      `${pageName}/-api/${pathName}-/${name}_FAIL`,
      `${pageName}/-api/${pathName}-/${name}_TOAST_CLEAR`
    ];
    // 常量
    Object.assign(constants, {
      [name]: types[0],
      [name + '_SUCCESS']: types[1],
      [name + '_FAIL']: types[2],
      [name + '_TOAST_CLEAR']: types[3]
    });
    // 方法
    if (action === 'C') {
      methods.create = menthodCreater('post', types, pathName);
    } else if (action === 'U') {
      methods.update = menthodCreater('put', types, pathName);
    } else if (action === 'R') {
      methods.read = menthodCreater('get', types, pathName);
    } else if (action === 'D') {
      methods.delete = menthodCreater('delete', types, pathName);
    }
  }
}

export default function CURDcreater(pageName, pathName, actions, apiName) {
  const constants = {};
  const methods = {};
  const actionsMap = {
    'C': 'CREATE',
    'U': 'UPDATE',
    'R': 'READ',
    'D': 'DELETE'
  }

  actions.toUpperCase().split('').forEach((action) => {
    menthodsAndConstantsCreater(pathName, actions, action, constants, methods, actionsMap[action], pageName);
  })
  const reducerCreater = function(state, action, success = {}) {
    apiName = apiName || pathName;

    let result = {...state};
    let key = action.others && action.others.key;
    let makeValue = (value) => {
      if (key != null) {
        objectPath.set(result.api[apiName], key, value);
      } else {
        result.api[apiName] = value;
      }
    }

    switch (action.type) {
      case constants.READ:
        makeValue({
          reading: true
        });
        return result;
      case constants.READ_SUCCESS:
        makeValue({
          readed: true,
          readData: action.data
        });
        success.read && success.read(result);

        return result;
      case constants.READ_FAIL:
        makeValue({
          readError: action.error,
          showToast: true
        });
        return result;
      case constants.READ_TOAST_CLEAR:
        makeValue({
          readError: action.error
        });
        return result;
      case constants.CREATE:
      case constants.UPDATE:
        makeValue({
          editing: true
        });
        return result;
      case constants.CREATE_SUCCESS:
      case constants.UPDATE_SUCCESS:
        makeValue({
          edited: true,
          editData: action.data
        });
        success.create && success.create(result);
        success.update && success.update(result);

        return result;
      case constants.CREATE_FAIL:
      case constants.UPDATE_FAIL:
        makeValue({
          editError: action.error,
          showToast: true
        });
        return result;
      case constants.CREATE_TOAST_CLEAR:
      case constants.UPDATE_TOAST_CLEAR:
        makeValue({
          editError: action.error
        });
        return result;
      case constants.DELETE:
        makeValue({
          deleteing: true
        });
        return result;
      case constants.DELETE_SUCCESS:
        makeValue({
          deleted: true,
          deleteData: action.data
        });
        success.delete && success.delete(result);

        return result;
      case constants.DELETE_FAIL:
        makeValue({
          deleteError: action.error,
          showToast: true
        });
        return result;
      case constants.DELETE_TOAST_CLEAR:
        makeValue({
          deleteError: action.error
        });
        return result;
    }
  }

  return { methods, reducerCreater };
}
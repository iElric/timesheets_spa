import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze-strict';

let session0 = localStorage.getItem('session');
if (session0) {
  session0 = JSON.parse(session0);
}
function session(st0 = session0, action) {
  switch (action.type) {
    case 'LOG_IN':
      return action.data;
    case 'LOG_OUT':
      return null;
    default:
      return st0;
  }
}

function login(st0 = { email: "", password: "", errors: null }, action) {
  switch (action.type) {
    case 'CHANGE_LOGIN':
      return Object.assign({}, st0, action.data);
    default:
      return st0;
  }
}


function new_timesheets(st0 = {
  jobcodes: ["", "", "", "", "", "", "", ""],
  hours: [0, 0, 0, 0, 0, 0, 0, 0],
  descs: ["", "", "", "", "", "", "", ""],
  errors: null
}, action) {
  switch (action.type) {
    default:
      return st0;
  }
}


/* A Redux reducer is just a JavaScript 
function. It takes two parameters: the 
current state and action  */
function root_reducer(st0, action) {
  console.log("root reducer", st0, action);
  let reducer = combineReducers({
    login,
    session,
    new_timesheets,
  });
  return deepFreeze(reducer(st0, action));
}

let store = createStore(root_reducer);
export default store;

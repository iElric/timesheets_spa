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
  options: null,
  jobcodes: ["", "", "", "", "", "", "", ""],
  hours: [0, 0, 0, 0, 0, 0, 0, 0],
  descs: ["", "", "", "", "", "", "", ""],
  date: null,
  errors: null
}, action) {
  switch (action.type) {
    case "ALL_JOBCODES":
      return Object.assign({}, st0, { options: action.data });
    case "CHANGE_JOBCODE":
      let new_jobcodes = st0.jobcodes.map((j, i) => i === action.index ? action.data : j);
      console.log(Object.assign({}, st0, { jobcodes: new_jobcodes }));
      return Object.assign({}, st0, { jobcodes: new_jobcodes });
    case "CHANGE_DESC":
      let new_descs = st0.descs.map((j, i) => i === action.index ? action.data : j);
      console.log(Object.assign({}, st0, { descs: new_descs }));
      return Object.assign({}, st0, { descs: new_descs });
    case "CHANGE_HOUR":
      let new_hours = st0.hours.map((j, i) => i === action.index ? action.data : j);
      console.log(new_hours);
      console.log(Object.assign({}, st0, { hours: new_hours }));
      return Object.assign({}, st0, { hours: new_hours });
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

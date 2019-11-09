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
  hours: ["", "", "", "", "", "", "", ""],
  descs: ["", "", "", "", "", "", "", ""],
  date: "",
  errors: null,
  task_num: 8
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
    case "CHANGE_DATE":
      return Object.assign({}, st0, { date: action.data });
    case "PLUS":
      return Object.assign({}, st0, { task_num: action.data });
    case "MINUS":
      return Object.assign({}, st0, { task_num: action.data });
    /* case "INIT_JOBCODES":
      let jb = [];
      for (let i = 0; i < 8; i++) {
        jb.push(action.data);
      }
      console.log(jb);
      return Object.assign({}, st0, {jobcodes: jb}); */
    default:
      return st0;
  }
}

function show_timesheets(st0 = {
  tasks: [],
  date: "",
  errors: null
}, action) {
  switch (action.type) {
    case "CHANGE_SHOW_DATE":
      return Object.assign({}, st0, { date: action.data });
    case "CHANGE_TASKS":
      return Object.assign({}, st0, { tasks: action.data });
    default:
      return st0;
  }
}

function approve_timesheets(st0 = {
  date: "",
  // this is the selected worker name
  worker_name: null,
  // this is all worker names for select
  options: null,
  tasks: [],
}, action) {
  switch (action.type) {
    case "ALL_WORKERS":
      return Object.assign({}, st0, { options: action.data });
    case "CHANGE_APPROVE_DATE":
      return Object.assign({}, st0, { date: action.data });
    case "CHANGE_WORKER":
      return Object.assign({}, st0, { worker_name: action.data });
    case "CHANGE_APPROVE_TASKS":
      return Object.assign({}, st0, { tasks: action.data });
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
    show_timesheets,
    approve_timesheets,
  });
  return deepFreeze(reducer(st0, action));
}

let store = createStore(root_reducer);
export default store;

import store from './store';

export function all_jobcodes() {
  get('/jobs')
    .then((resp) => {
      console.log(resp);
      store.dispatch({
        type: 'ALL_JOBCODES',
        data: resp,
      });
    });
}



export function get(path) {
  let state = store.getState();
  let token = state.session.token;

  return fetch('/ajax' + path, {
    method: 'get',
    credentials: 'same-origin',
    headers: new Headers({
      'x-csrf-token': window.csrf_token,
      'content-type': "application/json; charset=UTF-8",
      'accept': 'application/json',
      'x-auth': token || "",
    }),
  }).then((resp) => resp.json());
}


export function post(path, body) {
  let state = store.getState();
  let token = state.session.token;

  return fetch('/ajax' + path, {
    method: 'post',
    credentials: 'same-origin',
    headers: new Headers({
      'x-csrf-token': window.csrf_token,
      'content-type': "application/json; charset=UTF-8",
      'accept': 'application/json',
      'x-auth': token || "",
    }),
    body: JSON.stringify(body),
  }).then((resp) => resp.json());
}

export function login_post(path, body) {
  let state = store.getState();

  return fetch('/ajax' + path, {
    method: 'post',
    credentials: 'same-origin',
    headers: new Headers({
      'x-csrf-token': window.csrf_token,
      'content-type': "application/json; charset=UTF-8",
      'accept': 'application/json',
    }),
    body: JSON.stringify(body),
  }).then((resp) => resp.json());
}

export function submit_login(form) {
  let state = store.getState();
  let data = state.login;

  login_post('/sessions', data)
    .then((resp) => {
      console.log(resp);
      if (resp.token) {
        /* store the session in local storage */
        localStorage.setItem('session', JSON.stringify(resp));
        store.dispatch({
          type: 'LOG_IN',
          data: resp,
        });
        if (JSON.parse(localStorage.getItem("session")).is_manager) {
          form.redirect('/timesheets/approve')
        } else {
          form.redirect('/timesheets/new');
        }
      }
      else {
        store.dispatch({
          type: 'CHANGE_LOGIN',
          data: { errors: JSON.stringify(resp.errors) },
        });
      }
    });
}

export function create_sheet(form) {
  let data = store.getState().new_timesheets;
  console.log(data);
  let user_id = JSON.parse(localStorage.getItem("session")).user_id;
  post("/sheets", Object.assign({}, data, { user_id: user_id })).then(resp => {
    alert(resp.status);
  });
}

export function show_sheet(form) {
  let data = store.getState().show_timesheets;
  let user_id = JSON.parse(localStorage.getItem("session")).user_id;
  post("/sheets/show_sheet", Object.assign({}, data, { user_id: user_id })).then(resp => {
    console.log(resp.tasks);
    store.dispatch({
      type: "CHANGE_TASKS",
      data: resp.tasks,
    })
  });
}

export function show_worker_sheet(form) {
  let data = store.getState().approve_timesheets;
  let user_id = JSON.parse(localStorage.getItem("session")).user_id;
  post("/sheets/show_worker_sheet", Object.assign({}, data, { user_id: user_id })).then(resp => {
    store.dispatch({
      type: "CHANGE_APPROVE_TASKS",
      data: resp.tasks,
    })
  });
}

export function all_workers(form) {
  let user_id = JSON.parse(localStorage.getItem("session")).user_id;
  console.log(user_id);
  /* This will go to user_controller's show function */
  get('/users/' + user_id)
  .then((resp) => {
    console.log(resp);
    store.dispatch({
      type: "ALL_WORKERS",
      data: resp.worker_names,
    })
  });
}

export function approve(form) {
  let data = store.getState().approve_timesheets;
  let user_id = JSON.parse(localStorage.getItem("session")).user_id;
  post("/sheets/approve", Object.assign({}, data, { user_id: user_id })).then(resp => {
    store.dispatch({
      type: "CHANGE_APPROVE_TASKS",
      data: resp.tasks,
    })
  });

}
import store from './store';

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

export function submit_login(form) {
    let state = store.getState();
    let data = state.forms.login;

    post('/sessions', data)
        .then((resp) => {
            console.log(resp);
            if (resp.token) {
                /* store the session in local storage */
                localStorage.setItem('session', JSON.stringify(resp));
                store.dispatch({
                    type: 'LOG_IN',
                    data: resp,
                });
                form.redirect('/');
            }
            else {
                store.dispatch({
                    type: 'CHANGE_LOGIN',
                    data: { errors: JSON.stringify(resp.errors) },
                });
            }
        });
}
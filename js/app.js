// --------------------------------
// -------data to store in LS------
// --------------------------------

const storageData = {
  loadedData: {
    users: false,
    usersPath: '/data/auth.json',
  },
  auth: {
    isAuth: false,
    isAdmin: false,
    name: '',
    login: '',
    password: '',
  },
  users: [],
};

// --------------------------------
// -------application data   ------
// --------------------------------

const dataMain = {
  loginPanel: {
    login: '',
    password: '',
    loginErrorText: '',
  },
  registerPanel: {
    login: '',
    name: '',
    password: '',
    password2: '',
    registerErrorText: '',
    agree: false,
  },
};

// --------------------------------
// -------controller data    ------
// --------------------------------

const methods = {
  doSomething() {
    // const { data } = this._model;
    // this._router.refresh();
    // const { mainData } = this._model.data;
    // this._route(`search.html?query=${search}`);
    // DOM reference
    // const { DOMreferences } = this._view;
    // const el = DOMreferences[`news-${id}`];
  },
  loginPanelClear() {
    const { data } = this._model;
    const { loginPanel } = data;
    loginPanel.login = '';
    loginPanel.password = '';
    loginPanel.loginErrorText = '';
  },
  checkLogin() {
    const { data } = this._model;
    const { loginPanel } = data;
    const { mainData } = this._model.data;

    const user = mainData.users.find(
      x =>
        x.password === loginPanel.password &&
        x.login.toUpperCase() === loginPanel.login.toUpperCase(),
    );
    if (user) {
      mainData.auth = user;
      this.loginPanelClear();
      this._route('index.html');
    } else {
      loginPanel.loginErrorText = 'invalid credentials';
      loginPanel.password = '';
      this._router.refresh();
    }
  },
  registerPanelClear() {
    const { registerPanel } = this._model.data;
    registerPanel.login = '';
    registerPanel.password = '';
    registerPanel.password2 = '';
    registerPanel.name = '';
    registerPanel.registerErrorText = '';
  },
  checkRegister() {
    const { data } = this._model;
    const { mainData } = this._model.data;
    const { registerPanel } = data;
    const { password, password2, agree } = registerPanel;
    let { login, name } = registerPanel;
    login = login.trim();
    name = name.trim();
    registerPanel.password = '';
    registerPanel.password2 = '';

    if (password !== password2) {
      registerPanel.registerErrorText = 'Passwords are not equal!';
      this._router.refresh();
      return;
    }

    let user = mainData.users.find(
      x => x.login.toUpperCase() === registerPanel.login.toUpperCase(),
    );

    if (user) {
      registerPanel.registerErrorText = 'Such login exists!';
      this._router.refresh();
      return;
    }

    if (password.length < 3) {
      registerPanel.registerErrorText = 'Password too short!';
      this._router.refresh();
      return;
    }

    if (login.length < 3) {
      registerPanel.registerErrorText = 'Login too short!';
      this._router.refresh();
      return;
    }

    if (name.length < 3) {
      registerPanel.registerErrorText = 'Name too short!';
      this._router.refresh();
      return;
    }

    if (!agree) {
      registerPanel.registerErrorText = 'Without agreement you cannot pass';
      this._router.refresh();
      return;
    }

    let id = mainData.users.reduce((a, b) => {
      Math.max(a, b.id);
    }, 0);

    id += 1;
    mainData.users = [
      ...mainData.users,
      {
        login,
        name,
        password,
        id,
        isAuth: true,
        isAdmin: false,
      },
    ];

    user = mainData.users.find(
      x =>
        x.password === password &&
        x.login.toUpperCase() === login.toUpperCase(),
    );
    if (user) {
      mainData.auth = user;
      this.registerPanelClear();
      this._route('index.html');
    } else {
      registerPanel.loginErrorText = 'something wrong. Try again';
      this._router.refresh();
    }
  },
  logout() {
    const { mainData } = this._model.data;
    mainData.auth = storageData.auth;
    this.loginPanelClear();
    this._router.refresh();
  },
};

// ---------------------
// before render section
// syntax:
// const beforeRenderIndex = (model, cb) => { cb(); };
// ---------------------

//   loadToStorage(model, 'review')
//  review in storage
function loadToStorage(model, dataName) {
  const { storage } = model;
  return model._isLocalChecked
    .then(() => {
      if (storage.mainData.loadedData[dataName]) throw new Error('test');
    })
    .then(() => fetch(storage.mainData.loadedData[`${dataName}Path`]))
    .then(res => res.json())
    .then(res => {
      storage.mainData[dataName] = res;
      const tmp = { ...storage.mainData.loadedData };
      tmp[dataName] = true;
      storage.mainData.loadedData = tmp;
    })
    .catch(() => new Promise(res => res()));
}

const beforeRenderIndex = (model, cb) => {
  // const { data } = model;
  // model._router.goToStartPage();
  cb();
};

const beforeRenderLogin = (model, cb) => {
  const { data } = model;
  if (data.mainData.auth.isAuth) {
    model._router.goToStartPage();
    return;
  }
  loadToStorage(model, 'users').then(cb);
};

const beforeRenderRegister = (model, cb) => {
  const { data } = model;

  if (data.mainData.auth.isAuth) {
    model._router.goToStartPage();
    return;
  }
  loadToStorage(model, 'users').then(cb);
};

function MAIN() {
  const debugMode = false;
  // ---------------------
  // ---------------------
  const applicationVersion = '1.0.1';
  // eslint-disable-next-line
  const storage = new Storage(storageData, applicationVersion, debugMode);
  // eslint-disable-next-line
  const view = new View();

  // eslint-disable-next-line
  const model = new Model(dataMain, storage);
  // eslint-disable-next-line
  const controller = new Controller(methods, model);
  // eslint-disable-next-line
  const router = new Router([
    {
      pathname: '/index.html',
      model,
      controller,
      beforeRender: beforeRenderIndex,
      startPage: true,
      title: 'Main Page',
    },
    {
      pathname: '/login.html',
      model,
      controller,
      beforeRender: beforeRenderLogin,
      startPage: false,
      title: 'Login',
    },
    {
      pathname: '/register.html',
      model,
      controller,
      beforeRender: beforeRenderRegister,
      startPage: false,
      title: 'Register',
    },
  ]);
  // start application
  // eslint-disable-next-line
  const app = new Application({
    view,
    router,
    beginFromStartPage: true,
    version: applicationVersion,
  });
}
window.addEventListener('DOMContentLoaded', MAIN);

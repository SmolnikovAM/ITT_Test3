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
  users: {},
};

// --------------------------------
// -------application data   ------
// --------------------------------

const dataMain = {
  loginPanel: {
    login: '',
    password: '',
    isAuth: true,
    loginErrorText: '',
  },
};

// --------------------------------
// -------controller data    ------
// --------------------------------

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

const methods = {
  doSomething() {
    // const { data } = this._model;
    // page refresh // this._router.refresh();
    // storage // const { mainData } = this._model.data;
    // routing example // this._route(`search.html?query=${search}`);
    // DOM reference
    // const { DOMreferences } = this._view;
    // const el = DOMreferences[`news-${id}`];
  },
};

// ---------------------
// before render section
// syntax:
// const beforeRenderIndex = (model, cb) => { cb(); };
// ---------------------
const beforeRenderIndex = (model, cb) => {
  // const { data } = model;
  // model._router.goToStartPage());
  cb();
};
const beforeRenderLogin = (model, cb) => {
  // const { data } = model;
  // model._router.goToStartPage());
  cb();
};
const beforeRenderRegister = (model, cb) => {
  // const { data } = model;
  // model._router.goToStartPage());
  cb();
};

// ---------------------
// ---------------------
const applicationVersion = '1.0.1';
// eslint-disable-next-line
const storage = new Storage(storageData, applicationVersion);
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

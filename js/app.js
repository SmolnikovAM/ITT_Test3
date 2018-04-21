// --------------------------------
// -------data to store in LS------
// --------------------------------

const storageData = {};

// --------------------------------
// -------application data   ------
// --------------------------------

const dataMain = {};

// --------------------------------
// -------controller data    ------
// --------------------------------

const methods = {};

// ---------------------
// before render section
// syntax:
// const beforeRenderIndex = (model, cb) => { cb(); };
// ---------------------
const beforeRenderIndex = (model, cb) => {
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
    title: 'Начало',
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

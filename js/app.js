// --------------------------------
// -------data to store in LS------
// --------------------------------
let map;
let okGo;

let mapGoogle;
const promiseGo = new Promise(res => (okGo = res));

const storageData = {
  loadedData: {
    users: false,
    usersPath: '/data/auth.json',
    countries: false,
  },
  auth: {
    isAuth: false,
    isAdmin: false,
    name: '',
    login: '',
    password: '',
    id: '',
  },
  savedCountries: [],
  // [ {userId, country, comment }]
  users: [],
  countries: [],
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
  indexPanel: {
    autocomplete: 'Bulgaria',
    errorText: '',
    showCountries: [],
    sortType: 'nameUp',
  },
  showInfoPanel: {
    country: {},
    comment: '',
  },
};

// --------------------------------
// -------controller data    ------
// --------------------------------

const methods = {
  doSomething(input) {
    console.log(input);
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
  addCountry(input, event) {
    const { data } = this._model;
    const { mainData } = data;
    if (event instanceof KeyboardEvent && event.keyCode === 13) {
      const userId = mainData.auth.id;
      const userData = mainData.savedCountries.filter(x => x.userId === userId);
      if (userData.find(x => x.country === input) === undefined) {
        mainData.savedCountries = [
          ...mainData.savedCountries,
          { userId, country: input, comment: '' },
        ];
        data.indexPanel.errorText = 'Country added';
        console.log('Country added');
        this._router.refresh();
      } else {
        console.log('Already have');
        data.indexPanel.errorText = 'Already have this country';
        this._router.refresh();
      }
    }

    // const { data } = this._model;
    // this._router.refresh();
    // const { mainData } = this._model.data;
    // this._route(`search.html?query=${search}`);
    // DOM reference
    // const { DOMreferences } = this._view;
    // const el = DOMreferences[`news-${id}`];
  },
  showInformation(name) {
    const url = `about-country.html?name=${name}`;
    this._router.route(url);
  },
  saveComment(country) {
    const { data } = this._model;
    const { comment } = data.showInfoPanel;
    const userId = data.mainData.auth.id;
    data.mainData.savedCountries = [
      ...data.mainData.savedCountries.filter(
        x => !(x.userId === userId && x.country === country),
      ),
      { userId, country, comment },
    ];

    this._router.refresh();
  },
  sortName() {
    const { data } = this._model;
    const { indexPanel } = data;
    if (indexPanel.sortType === 'nameUp') {
      indexPanel.sortType = 'nameDown';
    } else {
      indexPanel.sortType = 'nameUp';
    }
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
  const { data } = model;
  console.log('refresh');
  model.data.indexPanel.showCountries = [];
  if (!data.mainData.auth.isAuth) {
    cb();
    model._router.goToStartPage();
    return;
  }
  // console.log(model);

  const isLoaded = () => {
    if (!model.data.mainData.loadedData.countries)
      return fetch('https://restcountries.eu/rest/v2/all')
        .then(res => res.json())
        .then(res => {
          model.data.mainData.loadedData.countries = true;
          model.data.mainData.countries = res;
        });
    return new Promise(res => res());
  };

  isLoaded()
    .then(() => {
      const savedUsersCountries = data.mainData.savedCountries.filter(
        x => data.mainData.auth.id === x.userId,
      );
      model.data.indexPanel.showCountries = [];
      savedUsersCountries.forEach(c => {
        const countryData = model.data.mainData.countries.find(
          x => x.name === c.country,
        );
        const {
          name,
          flag,
          region,
          subregion,
          timezones,
          capital,
          currencies,
          area,
          population,
        } = countryData;
        model.data.indexPanel.showCountries.push({
          name,
          flag,
          region,
          subregion,
          timezones,
          capital,
          currencies,
          area,
          population,
        });

        if (model.data.indexPanel.sortType === 'nameUp') {
          model.data.indexPanel.showCountries = model.data.indexPanel.showCountries.sort(
            (a, b) => (a.name > b.name ? 1 : -1),
          );
        } else {
          model.data.indexPanel.showCountries = model.data.indexPanel.showCountries.sort(
            (a, b) => (a.name < b.name ? 1 : -1),
          );
        }
      });
    })
    .then(cb);
  // .then(() => {
  //   const { DOMreferences } = model._router.view;
  //   const el = DOMreferences['autocomplete'];
  //   el.value = 'Bulgaria';
  //   data.indexPanel.autocomplete = 'Bulgaria';
  // });
};

const beforeRenderLogin = (model, cb) => {
  const { data } = model;
  if (data.mainData.auth.isAuth) {
    cb();
    // model._router.route('index.html');
    return;
  }

  loadToStorage(model, 'users').then(cb);
};

const beforeRenderRegister = (model, cb) => {
  const { data } = model;

  if (data.mainData.auth.isAuth) {
    model._router.route('index.html');
    return;
  }
  loadToStorage(model, 'users').then(cb);
};

const beforeRenderAbout = (model, cb) => {
  const { data } = model;
  const name = data.params.name;
  console.log(name);
  fetch(`https://restcountries.eu/rest/v2/name/${name}`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      const d = data.mainData.savedCountries.find(
        x => x.userId === data.mainData.auth.id,
      );

      data.showInfoPanel.country = res[0];
      data.showInfoPanel.comment = '';
      if (d) {
        data.showInfoPanel.comment = d.comment;
      }
    })

    .then(cb)
    .then(() => promiseGo)
    .then(() => {
      setTimeout(()=>{
      const {latlng } = data.showInfoPanel.country;
      // console.log(document.getElementById('googleMap'))
      const location= new google.maps.LatLng(latlng[0], latlng[1]);
      const mapProp = {
        center: location,
        zoom: 5,
      };

      mapGoogle = new google.maps.Map(
        document.getElementById('googleMap'),
        mapProp,
      );
      const marker = new google.maps.Marker({
        position: location,
        label: data.showInfoPanel.country.name,
        map: mapGoogle
      });
    },1300);

    });
};


// async function waitmap(){
//   while(true)

// }


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
      pathname: '/login.html',
      model,
      controller,
      beforeRender: beforeRenderLogin,
      startPage: true,
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
    {
      pathname: '/index.html',
      model,
      controller,
      beforeRender: beforeRenderIndex,
      startPage: false,
      title: 'Main',
    },
    {
      pathname: '/about-country.html',
      model,
      controller,
      beforeRender: beforeRenderAbout,
      startPage: false,
      title: 'about country',
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
  console.log(model);
}
window.addEventListener('DOMContentLoaded', MAIN);

function startMap() {
  okGo();
}

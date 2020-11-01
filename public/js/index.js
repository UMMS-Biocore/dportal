/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { refreshDmetaTable } from './dmetaTable';
import { showAlert } from './alerts';
import axios from 'axios';
var $ = require('jquery');
window.$ = $; // jquery installation
require('datatables.net'); // Datatables Core
require('datatables.net-bs4/js/dataTables.bootstrap4.js'); // Datatables Bootstrap 4
require('datatables.net-bs4/css/dataTables.bootstrap4.css'); // Datatables Bootstrap 4

// $(function() {
//   $('[data-toggle="tooltip"]').tooltip();
// });
// require('@coreui/icons/css/all.min.css');

// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './../css/style.css';
// import './../css/custom.css';

// GLOBAL SCOPE
let $scope = {};

// GLOBAL ENV CONFIG
const envConf = document.querySelector('#session-env-config');
const ssologin =
  envConf && envConf.getAttribute('sso_login') && envConf.getAttribute('sso_login') == 'true';

// DOM ELEMENTS
const logOutBtn = document.querySelector('.nav__el--logout');
const logInBtn = document.querySelector('.nav__el--login');
const afterSsoClose = document.querySelector('.after-sso-close');
const loginForm = document.querySelector('.form--login');

if (logOutBtn) logOutBtn.addEventListener('click', logout);

function popupwindow(url, title, w, h) {
  var left = screen.width / 2 - w / 2;
  var top = screen.height / 2 - h / 2;
  return window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  );
}

// open child window for SSO if user clicks on sign-in button
if (logInBtn && ssologin) {
  logInBtn.addEventListener('click', e => {
    e.preventDefault();
    var SSO_URL = envConf.getAttribute('sso_url');
    var CLIENT_ID = envConf.getAttribute('client_id');
    var SSO_REDIRECT_URL = `${window.location.origin}/receivetoken`;
    var SSO_FINAL_URL = `${SSO_URL}/dialog/authorize?redirect_uri=${SSO_REDIRECT_URL}&response_type=code&client_id=${CLIENT_ID}&scope=offline_access`;
    popupwindow(SSO_FINAL_URL, 'Login', 650, 800);
  });
}

if (afterSsoClose) {
  if (window.opener) {
    window.opener.focus();
    if (window.opener && !window.opener.closed) {
      window.opener.location.reload();
    }
  } else {
    window.location = envConf.getAttribute('base_url');
  }
  window.close();
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

(async () => {
  try {
    const send = { url: '/api/v1/data/sample/detailed' };
    const res = await axios({
      method: 'POST',
      url: '/api/v1/dmeta',
      data: send
    });
    console.log(res.data);
    refreshDmetaTable(res.data, 'dmetaDetailed');
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
})();

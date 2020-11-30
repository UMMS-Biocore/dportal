/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { prepareDmetaData } from './jsfuncs';
import { refreshDmetaTable } from './dmetaTable';
import { prepareBarGraph } from './chartjs';
import { prepareBreadcrumb } from './breadcrumb';
import { prepareSidebar } from './sidebar';
import { showAlert } from './alerts';
import axios from 'axios';
import 'jquery';
import '@coreui/coreui';
// import '@coreui/coreui/dist/css/coreui.min.css';

require('datatables.net'); // Datatables Core
require('datatables.net-bs4/js/dataTables.bootstrap4.js'); // Datatables Bootstrap 4
require('datatables.net-bs4/css/dataTables.bootstrap4.css'); // Datatables Bootstrap 4
// require('datatables.net-colreorder');
// require('datatables.net-colreorder-bs4');
// import './../css/style.css';
import './../vendors/@coreui/icons/css/free.min.css';
import './../vendors/@coreui/icons/css/flag.min.css';
import './../vendors/@coreui/icons/css/brand.min.css';

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
const dportalVersionBut = document.querySelector('#dportalVersionBut');

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
    const project = 'vitiligo';
    const send = { url: `/api/v1/projects/${project}/data/sample/detailed` };
    const res = await axios({
      method: 'POST',
      url: '/api/v1/dmeta',
      data: send
    });
    console.log(res.data);
    const data = prepareDmetaData(res.data);

    refreshDmetaTable(data, 'dmetaDetailed', project);
    prepareBarGraph(data, {
      dataCol: 'clinic_phen',
      xLabel: 'Clinical Phenotype',
      yLabel: 'Samples',
      colorSchema: 'Tableau10',
      chartId: 'basicBarChart1'
    });
    prepareBarGraph(data, {
      dataCol: 'lesional',
      xLabel: 'Skin',
      yLabel: 'Samples',
      colorSchema: 'Tableau10',
      chartId: 'basicBarChart2'
    });
    prepareBarGraph(data, {
      dataCol: 'status',
      xLabel: 'Status',
      yLabel: 'Samples',
      colorSchema: 'Tableau10',
      chartId: 'basicBarChart3'
    });
    prepareBreadcrumb(data);
    prepareSidebar(data);

    if (dportalVersionBut) {
      var checkLoad = $('#versionNotes').attr('readonly');
      if (typeof checkLoad === typeof undefined || checkLoad === false) {
        try {
          const res = await axios({
            method: 'GET',
            url: '/api/v1/misc/changelog'
          });
          const changeLogData = res.data.data;
          $('#versionNotes').val(JSON.parse(changeLogData));
          $('#versionNotes').attr('readonly', 'readonly');
        } catch (err) {
          console.log(err);
          return '';
        }
      }
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
})();

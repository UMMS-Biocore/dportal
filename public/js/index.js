/* eslint-disable */
import '@babel/polyfill';
var $ = require('jquery');
window.$ = $;
// Datatables Core
require('datatables.net');
// Datatables Bootstrap 4
require('datatables.net-bs4/js/dataTables.bootstrap4.js');
require('datatables.net-bs4/css/dataTables.bootstrap4.css');

// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './../css/style.css';
// import './../css/custom.css';

import { login, logout } from './login';
import { showAlert } from './alerts';
import axios from 'axios';

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

console.log($('#detailedSample'));

var refreshDmetaTable = function(data, id) {
  var TableID = '#' + id + 'Table';
  var searchBarID = '#' + id + 'SearchBar';

  var prepareDmetaData = data => {
    let ret = [];
    if (data.data && data.data.data) {
      ret = data.data.data;
      for (var i = 0; i < ret.length; i++) {
        if (ret[i].sample_summary) {
          let sample_summary = $.extend(true, {}, ret[i].sample_summary);
          delete ret[i].sample_summary;
          console.log(sample_summary);
          //merge sample_summary into ret[i]
          $.extend(ret[i], sample_summary);
        }
      }
    }
    return ret;
  };

  if (!$.fn.DataTable.isDataTable(TableID)) {
    var dataTableObj = {
      columns: [
        {
          data: 'name'
        },
        {
          data: 'status'
        },
        {
          data: 'collection_name'
        },
        {
          data: 'project_name'
        },
        {
          data: 'patient'
        },
        {
          data: 'aliquot'
        },
        {
          data: 'clinic_phen'
        },
        {
          data: 'lesional'
        },
        {
          data: 'patient_note'
        },
        {
          data: 'cell_density_tc'
        },
        {
          data: 'cell_density_indrop'
        },
        {
          data: 'collect_date'
        },
        {
          data: 'library_tube_id'
        },
        {
          data: 'pool_id'
        },
        {
          data: 'Total Reads'
        },
        {
          data: 'Multimapped Reads Aligned (STAR)'
        },
        {
          data: 'Unique Reads Aligned (STAR)'
        },
        {
          data: 'Total aligned UMIs (ESAT)'
        },
        {
          data: 'Total deduped UMIs (ESAT)'
        },
        {
          data: 'Duplication Rate'
        },
        {
          data: 'Number of Cells'
        },
        {
          data: 'Mean UMIs per Cell'
        },
        {
          data: 'Number of Genes'
        },
        {
          data: 'Mean Genes per Cell'
        },
        {
          data: 'date_created'
        },
        {
          data: 'owner'
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            let btn = '';
            if (oData.run_url) {
              var run_url = oData.run_url;
              btn = `<a href="${run_url}" target="_blank">View Run</a>`;
            }
            $(nTd).html(btn);
          }
        }
      ],
      select: {
        style: 'multi',
        selector: 'td:not(.no_select_row)'
      },
      order: [[24, 'desc']],
      columnDefs: [
        // {
        //   targets: [3, 4],
        //   className: 'disp_none'
        // },
        // {
        //   targets: [6],
        //   className: 'no_select_row'
        // },
        { defaultContent: '-', targets: '_all' } //hides undefined error
      ]
    };
    dataTableObj.dom = '<"' + searchBarID + '.pull-left"f>rt<"pull-left"i><"bottom"p><"clear">';
    dataTableObj.destroy = true;
    dataTableObj.data = prepareDmetaData(data);
    dataTableObj.hover = true;
    // speed up the table loading
    dataTableObj.deferRender = true;
    dataTableObj.scroller = true;
    dataTableObj.scrollCollapse = true;
    // dataTableObj.scrollY = 600;
    dataTableObj.scrollX = 500;
    dataTableObj.sScrollX = true;
    // dataTableObj.autoWidth = false;
    console.log(dataTableObj);
    console.log(TableID);

    var dmetaTable = $(TableID).DataTable(dataTableObj);
    console.log(TableID);
  }
  //    else {
  //        var dmetaTable = $(TableID).DataTable();
  //        projectTable.ajax.reload(null, false);
  //    }
  //    dmetaTable.column(0).checkboxes.deselect();
};

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

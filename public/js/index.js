/* eslint-disable */
// import '@babel/polyfill';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../css/style.css';
// import 'core-js/stable';
import 'regenerator-runtime/runtime';

const $ = require('jquery');
const dt = require('datatables.net')();
const https = require('https');

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

  if (!$.fn.DataTable.isDataTable(TableID)) {
    // th Multimapped Reads (STAR)
    // th Unique Reads (RSEM)
    // th Unique Reads (STAR)
    // th Added on
    // th View
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
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            console.log(oData);
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Total Reads'])
              dat = oData.sample_summary['Total Reads'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Multimapped Reads Aligned (STAR)'])
              dat = oData.sample_summary['Multimapped Reads Aligned (STAR)'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Unique Reads Aligned (STAR)'])
              dat = oData.sample_summary['Unique Reads Aligned (STAR)'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Total aligned UMIs (ESAT)'])
              dat = oData.sample_summary['Total aligned UMIs (ESAT)'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Total deduped UMIs (ESAT)'])
              dat = oData.sample_summary['Total deduped UMIs (ESAT)'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Duplication Rate'])
              dat = oData.sample_summary['Duplication Rate'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Number of Cells'])
              dat = oData.sample_summary['Number of Cells'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Mean UMIs per Cell'])
              dat = oData.sample_summary['Mean UMIs per Cell'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Number of Genes'])
              dat = oData.sample_summary['Number of Genes'];
            $(nTd).text(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Mean Genes per Cell'])
              dat = oData.sample_summary['Mean Genes per Cell'];
            $(nTd).text(dat);
          }
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
              btn = `<a href="${run_url}">View Run</a>`;
            }
            $(nTd).html(btn);
          }
        }
      ],
      select: {
        style: 'multi',
        selector: 'td:not(.no_select_row)'
      },
      order: [[3, 'desc']],
      columnDefs: [
        {
          targets: [3, 4],
          className: 'disp_none'
        },
        {
          targets: [6],
          className: 'no_select_row'
        },
        { defaultContent: '-', targets: '_all' } //hides undefined error
      ]
    };
    dataTableObj.dom = '<"' + searchBarID + '.pull-left"f>rt<"pull-left"i><"bottom"p><"clear">';
    dataTableObj.destroy = true;
    dataTableObj.data = data.data.data;
    dataTableObj.hover = true;
    // speed up the table loading
    dataTableObj.deferRender = true;
    dataTableObj.scroller = true;
    dataTableObj.scrollCollapse = true;
    // dataTableObj.scrollY = 395;
    dataTableObj.scrollX = 500;
    dataTableObj.sScrollX = true;
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

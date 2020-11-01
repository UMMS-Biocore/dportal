/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { showAlert } from './alerts';
import axios from 'axios';
var $ = require('jquery');
window.$ = $; // jquery installation
require('datatables.net'); // Datatables Core
require('datatables.net-bs4/js/dataTables.bootstrap4.js'); // Datatables Bootstrap 4
require('datatables.net-bs4/css/dataTables.bootstrap4.css'); // Datatables Bootstrap 4

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

var refreshDmetaTable = function(data, id) {
  var TableID = '#' + id + 'Table';
  var searchBarID = '#' + id + 'SearchBar';

  var prepareDmetaData = data => {
    let ret = [];
    if (data.data && data.data.data) {
      ret = data.data.data;
    }
    return ret;
  };

  var initCompDmetaTable = function(settings, json) {
    var api = new $.fn.dataTable.Api(settings);
    $(TableID + '_filter').css('display', 'inline-block');
    var toogleShowColsId = 'toogleShowColsId';
    $(searchBarID).append(
      '<div style="margin-bottom:20px; padding-left:8px; display:inline-block;" id="' +
        toogleShowColsId +
        '"></div>'
    );
    const colSelectMenu =
      '<div class="collapse" id="collapseExample"><div class="card card-body">Sed feugiat egestas nisl sed faucibus. Fusce nisi metus, accumsan eget ullamcorper eget, iaculis id augue. Vivamus porta elit id nulla varius, in sodales massa bibendum. Nullam condimentum pellentesque est, vel lacinia ipsum efficitur sed. Morbi porttitor porta commodo.</div></div>';
    const colSelectBtn =
      '<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"> <i class="cil-chart-table"></i> </button>';

    $('#' + toogleShowColsId).append(colSelectBtn);
    $(searchBarID).append(colSelectMenu);
  };

  if (!$.fn.DataTable.isDataTable(TableID)) {
    const mainCols = [
      'name',
      'status',
      'collection_name',
      'project_name',
      'patient',
      'aliquot',
      'clinic_phen',
      'lesional',
      'patient_note',
      'cell_density_tc',
      'cell_density_indrop',
      'collect_date',
      'library_tube_id',
      'pool_id',
      'sample_summary.Total Reads',
      'sample_summary.Multimapped Reads Aligned (STAR)',
      'sample_summary.Unique Reads Aligned (STAR)',
      'sample_summary.Total aligned UMIs (ESAT)',
      'sample_summary.Total deduped UMIs (ESAT)',
      'sample_summary.Duplication Rate',
      'sample_summary.Number of Cells',
      'sample_summary.Mean UMIs per Cell',
      'sample_summary.Number of Genes',
      'sample_summary.Mean Genes per Cell',
      'date_created',
      'owner'
    ];
    const showHideCols = [];
    let columns = [];
    for (var i = 0; i < mainCols.length; i++) {
      columns.push({ data: mainCols[i] });
    }
    columns.push({
      data: null,
      fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
        let btn = '';
        if (oData.run_url) {
          var run_url = oData.run_url;
          btn = `<a href="${run_url}" target="_blank">View Run</a>`;
        }
        $(nTd).html(btn);
      }
    });

    var dataTableObj = {
      columns: columns,
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
      ],
      initComplete: initCompDmetaTable
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

    $scope.dmetaTable = $(TableID).DataTable(dataTableObj);
    $('a.toggle-vis').on('click', function(e) {
      e.preventDefault();
      // Get the column API object
      var column = $scope.dmetaTable.column($(this).attr('data-column'));
      // Toggle the visibility
      column.visible(!column.visible());
    });
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

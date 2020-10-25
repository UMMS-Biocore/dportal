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
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';
import axios from 'axios';

// DOM ELEMENTS
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const loginForm = document.querySelector('.form--login');

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
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
            $(nTd).html(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Multimapped Reads Aligned (RSEM)'])
              dat = oData.sample_summary['Multimapped Reads Aligned (RSEM)'];
            $(nTd).html(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Multimapped Reads Aligned (STAR)'])
              dat = oData.sample_summary['Multimapped Reads Aligned (STAR)'];
            $(nTd).html(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Unique Aligned Reads (RSEM)'])
              dat = oData.sample_summary['Unique Aligned Reads (RSEM)'];
            $(nTd).html(dat);
          }
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            var dat = '';
            if (oData.sample_summary && oData.sample_summary['Unique Reads Aligned (STAR)'])
              dat = oData.sample_summary['Unique Reads Aligned (STAR)'];
            $(nTd).html(dat);
          }
        },
        {
          data: 'date_created'
        },
        {
          data: null,
          fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
            // $(nTd).html(
            //   '<button type="button" class="btn btn-default btn-sm showDetailSample"> Details</button>'
            // );
            $(nTd).html('Details');
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

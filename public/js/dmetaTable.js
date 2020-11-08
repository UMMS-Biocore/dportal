/* eslint-disable */
import { cleanSpecChar } from './jsfuncs';
import example_analysis from './../assets/img/example_analysis.png'; // relative path to image
// GLOBAL SCOPE
let $s = {};
export const getDmetaColumns = () => {
  return $s;
};
// Config for Dmeta table
// Main columns for table
$s.mainCols = [
  '$plusButton',
  'name',
  'status',
  'experiment_series',
  'experiment',
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
  'owner',
  '$detailsButton'
];

$s.mainColLabels = [
  '',
  'Name',
  'Status',
  'Experiment series',
  'Experiment',
  'Patient',
  'Aliquot',
  'Clinical phenotype',
  'Skin',
  'Patient Note',
  'Cell density (TC)',
  'Cell density indrop',
  'Collect date',
  'Library tube id',
  'Pool id',
  'Total Reads',
  'Multimapped Reads',
  'Unique Reads',
  'Total aligned UMIs',
  'Total deduped UMIs',
  'Duplication Rate',
  'Number of Cells',
  'Mean UMIs per Cell',
  'Number of Genes',
  'Mean Genes per Cell',
  'Added on',
  'Owner',
  'Run'
];

// columns that are going to be visible on startup
$s.initialShowCols = [
  '$plusButton',
  'name',
  'status',
  'experiment',
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
  'sample_summary.Mean UMIs per Cell',
  'date_created',
  'owner',
  '$detailsButton'
];

// columns that listed in configuration menu
// each config column defined in different object
// [{"main": ["name", "status"]}, {"sample_summary":'sample_summary.Total Reads'}]

$s.showHideCols = [];
$s.showHideCols.push({
  main: [
    'name',
    'status',
    'experiment_series',
    'experiment',
    'patient',
    'aliquot',
    'clinic_phen',
    'lesional',
    'patient_note',
    'cell_density_tc',
    'cell_density_indrop',
    'collect_date',
    'library_tube_id',
    'pool_id'
  ]
});
$s.showHideCols.push({
  sample_summary: [
    'sample_summary.Total Reads',
    'sample_summary.Multimapped Reads Aligned (STAR)',
    'sample_summary.Unique Reads Aligned (STAR)',
    'sample_summary.Total aligned UMIs (ESAT)',
    'sample_summary.Total deduped UMIs (ESAT)',
    'sample_summary.Duplication Rate',
    'sample_summary.Number of Cells',
    'sample_summary.Mean UMIs per Cell',
    'sample_summary.Number of Genes',
    'sample_summary.Mean Genes per Cell'
  ]
});

$s.sidebarFilterCols = [
  'status',
  'experiment_series',
  'experiment',
  'patient',
  'aliquot',
  'clinic_phen',
  'lesional',
  'pool_id',
  'owner'
];

// input: selected mainCols in array
// returns: labels in array
export const getSelectedColLabels = selCols => {
  let colLabels = [];
  for (var i = 0; i < selCols.length; i++) {
    console.log(selCols[i]);
    const ind = $s.mainCols.indexOf(selCols[i]);
    if (ind > -1) {
      colLabels.push($s.mainColLabels[ind]);
    }
  }
  return colLabels;
};

const getHideColIds = () => {
  let hideCols = [];
  for (var i = 0; i < $s.mainCols.length; i++) {
    if ($s.initialShowCols.indexOf($s.mainCols[i]) < 0) hideCols.push(i);
  }
  return hideCols;
};

const getShowHideBtns = colName => {
  let btn = '';
  const ind = $s.mainCols.indexOf(colName);
  if (ind >= 0 && $s.mainColLabels[ind]) {
    const divID = cleanSpecChar(colName);
    btn = `<div class="form-check">
      <input data-column="${ind}" class="form-check-input toggle-vis" type="checkbox" value="" id="${divID}">
      <label class="form-check-label" for="${divID}">
        ${$s.mainColLabels[ind]}
      </label>
    </div>`;
  }
  return btn;
};

const getColSelectMenu = () => {
  let menuDiv = `<div class="collapse" id="colSelectMenu" style="margin-bottom: 10px;">
  <div class="row">
  <div class="col-sm-12"><dt>Configure Visible Columns</dt></div>
  </div>
  <div class="row">`;
  //<div class="col-sm-4">${btn}${btn}</div>
  for (var i = 0; i < $s.showHideCols.length; i++) {
    menuDiv += `<div class="col-sm-3">`;
    const cols = Object.values($s.showHideCols[i]);
    for (var k = 0; k < cols[0].length; k++) {
      menuDiv += getShowHideBtns(cols[0][k]);
    }
    menuDiv += `</div>`;
  }
  menuDiv += `</div>`;
  return menuDiv;
};

const insertTableHeaders = () => {
  for (var i = 0; i < $s.mainColLabels.length; i++) {
    $('#dmetaDetailedTableHeader').append(`<th>${$s.mainColLabels[i]}</th>`);
  }
};

export const refreshDmetaTable = function(data, id) {
  var TableID = '#' + id + 'Table';
  var searchBarID = '#' + id + 'SearchBar';
  insertTableHeaders();

  var initCompDmetaTable = function(settings, json) {
    console.log('initCompDmetaTable');
    var api = new $.fn.dataTable.Api(settings);
    $(TableID + '_filter').css('display', 'inline-block');
    var toogleShowColsId = 'toogleShowColsId';
    $(searchBarID).append(
      '<div style="margin-bottom:20px; padding-left:8px; display:inline-block;" id="' +
        toogleShowColsId +
        '"></div>'
    );

    const colSelectMenu = getColSelectMenu();

    const colSelectBtn =
      '<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#colSelectMenu" aria-expanded="false" aria-controls="colSelectMenu"> <i class="cil-view-column"></i></button>';

    $('#' + toogleShowColsId).append(colSelectBtn);
    $(searchBarID).append(colSelectMenu);

    // Bind event handler for toogle-vis checkbox
    $('input.toggle-vis').on('change', function(e) {
      var column = api.column($(this).attr('data-column'));
      column.visible(this.checked);
    });
    // Check
    for (var i = 0; i < $s.mainCols.length; i++) {
      if ($s.initialShowCols.indexOf($s.mainCols[i]) >= 0) {
        $("input.toggle-vis[data-column='" + i + "']").prop('checked', true);
      } else {
        $("input.toggle-vis[data-column='" + i + "']").prop('checked', false);
      }
    }

    // Bind event handler for toggle-filter checkbox at the sidebar
    $(document).on('change', 'input.toggle-filter', function(e) {
      var dataColumn = $(this).attr('data-column');
      let vals = [];
      var dataFilters = $(`input.toggle-filter[data-column="${dataColumn}"]`);
      for (var k = 0; k < dataFilters.length; k++) {
        if ($(dataFilters[k]).is(':checked')) {
          vals.push($(dataFilters[k]).attr('data-val'));
        }
      }
      var valReg = '';
      for (var k = 0; k < vals.length; k++) {
        var val = $.fn.dataTable.util.escapeRegex(vals[k]);
        if (val) {
          if (k + 1 !== vals.length) {
            valReg += val + '|';
          } else {
            valReg += val;
          }
        }
      }
      api
        .column(dataColumn)
        .search(valReg ? '(^|,)' + valReg + '(,|$)' : '', true, false)
        .draw();
    });

    var getHeaderRow = function(text) {
      if (!text) text = '';
      return '<thead><tr><th>' + text + '</th></tr></thead>';
    };
    var getBodyRow = function(text) {
      if (!text) {
        text = '';
      }
      return '<tbody><tr><td>' + text + '</td></tr></tbody>';
    };
    var pattClean = function(text) {
      if (!text) {
        text = '';
      } else if (text.match(/s3:/i) || text.match(/gs:/i)) {
        var textPath = $.trim(text).split('\t')[0];
        if (textPath) {
          text = textPath;
        }
      }
      return text;
    };

    const insertAnalysisContent = data => {
      let ret = `<div style="margin-top:10px;"><img style="height:350px;" src="${example_analysis}" alt="Example run"></div>`;
      return ret;
    };

    const getTableFromList = (label, value) => {
      if (!label[0] || !value[0]) return '';
      let ret = '<table class="table-not-striped" style="width:100%"><tbody>';
      for (var k = 0; k < value.length; k++) {
        ret += `<tr><td>${label[k]}</td><td>${value[k]}</td></tr>`;
      }
      ret += '</tbody></table>';
      return ret;
    };

    const getRunBlock = (label, value, type, listHeader) => {
      let ret = '';
      if (value) {
        if (type === 'single') {
          ret = `
          <div class="col-sm-6">
            <div class="card" style="height:125px;">
              <div class="card-body">
                <h2 style="text-align: center;">${label}</h2>
                <div class="summary_card_hero">${value}</div>
              </div>
            </div>
          </div>`;
        } else if (type === 'double') {
          ret = `
          <div class="col-sm-6">
            <div class="card" style="height:125px;">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-6">
                    <h4>${label[0]}</h4>
                    <div class="summary_card_hero">${value[0]}</div>
                  </div>
                  <div class="col-sm-6">
                    <h4>${label[1]}</h4>
                    <div class="summary_card_hero">${value[1]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
        } else if (type === 'list') {
          const table = getTableFromList(label, value);
          if (!table) return '';
          let headerDiv = '';
          if (listHeader) headerDiv = `<h4 style="text-align: center;">${listHeader}</h4>`;
          ret = `
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body summary_card">
                ${headerDiv}
                ${table}
              </div>
            </div>
          </div>`;
        }
      }
      return ret;
    };
    var insertRunContent = function(data) {
      let blocks = '';
      blocks += getRunBlock('Number of Cells', data.sample_summary['Number of Cells'], 'single');
      blocks += getRunBlock(
        'Mean UMIs per Cell',
        data.sample_summary['Mean UMIs per Cell'],
        'single'
      );
      blocks += getRunBlock(
        [
          'Total Reads',
          'Unique Reads Aligned (STAR)',
          'Multimapped Reads Aligned (STAR)',
          'Total aligned UMIs (ESAT)',
          'Total deduped UMIs (ESAT)',
          'Duplication Rate'
        ],
        [
          data.sample_summary['Total Reads'],
          data.sample_summary['Unique Reads Aligned (STAR)'],
          data.sample_summary['Multimapped Reads Aligned (STAR)'],
          data.sample_summary['Total aligned UMIs (ESAT)'],
          data.sample_summary['Total deduped UMIs (ESAT)'],
          data.sample_summary['Duplication Rate']
        ],
        'list',
        'Mapping'
      );
      blocks += getRunBlock(
        ['Number of Cells', 'Number of Genes', 'Mean Genes per Cell', 'Mean UMIs per Cell'],
        [
          data.sample_summary['Number of Cells'],
          data.sample_summary['Number of Genes'],
          data.sample_summary['Mean Genes per Cell'],
          data.sample_summary['Mean UMIs per Cell']
        ],
        'list',
        'Cells'
      );

      const width = document.getElementById('dmetaTableContainer').offsetWidth - 60;
      let runUrlDiv = '';
      if (data.run_url)
        runUrlDiv = `<h5 style="margin-top:20px;"><a target="_blank" href="${data.run_url}"> Go to run <i class="cil-external-link"></i></a></h5>`;
      var content = `
       ${runUrlDiv}
      <div style="margin-top:20px; width:${width}px;">
        <div class="row">
          ${blocks}
        </div>
      </div>`;

      return content;
    };
    var insertFileContent = function(data, id) {
      let tableLabels = [];
      let tableValues = [];
      tableLabels.push('Name');
      tableValues.push(data.name);
      var cpData = $.extend(true, {}, data);
      var file_dir = cpData.file_dir;
      var files_used = cpData.files_used;
      // convert dmeta format (Array) to dnext format
      if (file_dir.constructor === Array) {
        file_dir = file_dir.join('\t');
      }
      if (files_used.constructor === Array) {
        for (var i = 0; i < files_used.length; i++) {
          files_used[i] = files_used[i].join(',');
        }
        files_used = files_used.join(' | ');
      }
      if (data.file_dir) {
        tableLabels.push('Input File(s) Directory');
        tableValues.push(pattClean(file_dir));
        tableLabels.push('Input File(s)');
        tableValues.push(files_used.replace(/\|/g, '<br/>'));
      } else {
        tableLabels.push('GEO ID');
        tableValues.push(files_used.replace(/\|/g, '<br/>'));
      }
      var collection_type = '';
      if (data.collection_type == 'single') {
        collection_type = 'Single/List';
      } else if (data.collection_type == 'pair') {
        collection_type = 'Paired List';
      }
      tableLabels.push('Collection Type');
      tableValues.push(collection_type);
      let blocks = '';
      blocks += getRunBlock(tableLabels, tableValues, 'list');
      var content = `
      <div style="margin-top:10px; width:1750px;">
        <div class="row">
          ${blocks}
        </div>
      </div>`;
      return content;
    };

    const formatChildRow = rowdata => {
      const rowid = cleanSpecChar(rowdata._id);
      const fileTabID = 'fileTab_' + rowid;
      const runTabID = 'runTab_' + rowid;
      const analysisTabID = 'analysisTab_' + rowid;

      let ret = '';
      const header = `
        <ul id="dmetaChildRow" class="nav nav-tabs" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#${fileTabID}" aria-expanded="true">
            Files
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#${runTabID}" aria-expanded="false">
            Run
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#${analysisTabID}" aria-expanded="false">
            Analysis
            </a>
          </li>
        </ul>`;
      const fileContent = insertFileContent(rowdata);
      const runContent = insertRunContent(rowdata);
      const analysisContent = insertAnalysisContent(rowdata);

      const content = `
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" searchtab="true" id="${fileTabID}">
          <div class="panel panel-default" style="display: block;">
            <div class="panel-body">
                <div class="box-body tab-pane active">
                  ${fileContent}
                </div>
            </div>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="${runTabID}" searchtab="true">
        ${runContent}
        </div>
        <div role="tabpanel" class="tab-pane" id="${analysisTabID}" searchtab="true">
        ${analysisContent}
        </div>`;

      ret += '<div role="tabpanel">';
      ret += header;
      ret += content;
      ret += '</div>';
      return ret;
    };

    // Add event listener for opening and closing details
    $(document).on('click', 'td.details-control', function(e) {
      var icon = $(this).find('i');
      console.log($(this));
      console.log(icon);
      var tr = $(this).closest('tr');
      var row = api.row(tr);
      if (row.child.isShown()) {
        // close child row
        row.child.hide();
        tr.removeClass('shown');
        icon.removeClass('cil-minus').addClass('cil-plus');
      } else {
        // Open child row
        console.log('row data');
        row.child(formatChildRow(row.data())).show();
        tr.addClass('shown');
        icon.removeClass('cil-plus').addClass('cil-minus');
      }
    });
  };

  if (!$.fn.DataTable.isDataTable(TableID)) {
    let columns = [];
    for (var i = 0; i < $s.mainCols.length; i++) {
      if ($s.mainCols[i] == '$detailsButton') {
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
      } else if ($s.mainCols[i] == '$plusButton') {
        columns.push({
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: '<i class="cil-plus"></i>'
        });
      } else {
        columns.push({ data: $s.mainCols[i] });
      }
    }
    var dataTableObj = {
      columns: columns,
      // select: {
      //   style: 'multi',
      //   selector: 'td:not(.no_select_row)'
      // },
      order: [[24, 'desc']],
      columnDefs: [
        {
          targets: getHideColIds(),
          visible: false
        },
        { defaultContent: '-', targets: '_all' } //hides undefined error
      ],
      initComplete: initCompDmetaTable
    };
    dataTableObj.dom = '<"' + searchBarID + '.pull-left"f>rt<"pull-left"i><"bottom"p><"clear">';
    dataTableObj.destroy = true;
    dataTableObj.data = data;
    dataTableObj.hover = true;
    // speed up the table loading
    dataTableObj.deferRender = true;
    dataTableObj.scroller = true;
    dataTableObj.scrollCollapse = true;
    // dataTableObj.scrollY = 600;
    dataTableObj.scrollX = 500;
    dataTableObj.sScrollX = true;
    // dataTableObj.autoWidth = false;
    $s.dmetaTable = $(TableID).DataTable(dataTableObj);
  }
  //    else {
  //        var dmetaTable = $(TableID).DataTable();
  //        projectTable.ajax.reload(null, false);
  //    }
  //    dmetaTable.column(0).checkboxes.deselect();
};

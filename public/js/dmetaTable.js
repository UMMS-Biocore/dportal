/* eslint-disable */
import { cleanSpecChar } from './jsfuncs';

// GLOBAL SCOPE
let $s = {};
//Config for Dmeta table
// Main columns for table
$s.mainCols = [
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
  'owner',
  ''
];

$s.mainColLabels = [
  'Name',
  'Status',
  'Collection',
  'Project',
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
  'Details'
];

// columns that are going to be visible on startup
$s.initialShowCols = [
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
  'sample_summary.Mean UMIs per Cell',
  'date_created',
  'owner'
];

// columns that listed in configuration menu
// each config column defined in different object
// [{"main": ["name", "status"]}, {"sample_summary":'sample_summary.Total Reads'}]

$s.showHideCols = [];
$s.showHideCols.push({
  main: [
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
  var prepareDmetaData = data => {
    let ret = [];
    if (data.data && data.data.data) {
      ret = data.data.data;
    }
    return ret;
  };

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

    // Bind event handler for checkbox
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
  };

  if (!$.fn.DataTable.isDataTable(TableID)) {
    let columns = [];
    for (var i = 0; i < $s.mainCols.length; i++) {
      if ($s.mainCols[i]) columns.push({ data: $s.mainCols[i] });
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
    $s.dmetaTable = $(TableID).DataTable(dataTableObj);
  }
  //    else {
  //        var dmetaTable = $(TableID).DataTable();
  //        projectTable.ajax.reload(null, false);
  //    }
  //    dmetaTable.column(0).checkboxes.deselect();
};

/* eslint-disable */
import { cleanSpecChar } from './jsfuncs';
import { createDataSummary } from './dataSummary';
import { getDmetaColumns, getSelectedColLabels } from './dmetaTable';

const getFilterCheckbox = (parentColIndex, label, count) => {
  let btn = '';
  const checkboxID = cleanSpecChar(label);
  btn = `<div class="form-check">
      <input data-val="${label}" data-column="${parentColIndex}" class="form-check-input toggle-filter" type="checkbox" value="" id="${checkboxID}">
      <label class="form-check-label" style="display:block; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;" for="${checkboxID}" >
        <span style="text-align:left;">${label}</span> <span style="float:right;">${count}</span>
      </label>
    </div>`;
  return btn;
};

const getChildDiv = (collapseID, parentColIndex, dataSummary) => {
  let div = '';
  div += `
<div class="collapse" id="${collapseID}">
  <div class="card-body">`;
  console.log(dataSummary);
  $.each(dataSummary, function(label) {
    const count = dataSummary[label];
    div += getFilterCheckbox(parentColIndex, label, count);
  });
  div += `</div></div>`;
  return div;
};

const insertSidebarBlocks = (cols, colLabels, dataSummary, colData) => {
  console.log(cols);
  console.log(dataSummary);
  let div = '';
  for (var i = 0; i < cols.length; i++) {
    const colName = cols[i];
    const parentLabel = colLabels[i];
    const collapseID = `collapse_${colName}`;
    const parentColIndex = colData.mainCols.indexOf(colName);
    const childDivs = getChildDiv(collapseID, parentColIndex, dataSummary[colName]);
    div += `
    <div class="accordion">
      <div class="card" style="margin-bottom:0px; border-radius:0px;">
         <div class="card-header" style="margin:0px; padding:0px;"><a class="btn text-left" type="button" data-toggle="collapse" data-target="#${collapseID}" aria-expanded="true" aria-controls="${collapseID}" style="display:inline-block; width:100%; height:100%; padding-left:10px;"><i class="cil cil-plus"> </i>${parentLabel}</a></div>
         ${childDivs}
      </div>
    </div>`;
  }
  $('#mainSidebarFilter').append(div);
};

export const prepareSidebar = function(data) {
  const colData = getDmetaColumns();
  const sideCols = colData.sidebarFilterCols;
  const colLabels = getSelectedColLabels(colData.sidebarFilterCols);
  console.log('colLabels', colLabels);
  if (sideCols) {
    const dataSummary = createDataSummary(data, sideCols);
    insertSidebarBlocks(sideCols, colLabels, dataSummary, colData);
    $('.collapse').on('show.coreui.collapse', function(e) {
      $(this)
        .prev('.card-header')
        .find('.cil')
        .removeClass('cil-plus')
        .addClass('cil-minus');
    });
    $('.collapse').on('hide.coreui.collapse', function(e) {
      $(this)
        .prev('.card-header')
        .find('.cil')
        .removeClass('cil-minus')
        .addClass('cil-plus');
    });
  }
};

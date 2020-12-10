/* eslint-disable */
export const cleanSpecChar = n => {
  if (n) {
    n = n
      .replace(/-/g, '_')
      .replace(/:/g, '_')
      .replace(/,/g, '_')
      .replace(/\$/g, '_')
      .replace(/\!/g, '_')
      .replace(/\</g, '_')
      .replace(/\>/g, '_')
      .replace(/\?/g, '_')
      .replace(/\(/g, '_')
      .replace(/\)/g, '_')
      .replace(/\"/g, '_')
      .replace(/\'/g, '_')
      .replace(/\./g, '_')
      .replace(/\//g, '_')
      .replace(/\\/g, '_')
      .replace(/@/g, '_');
  }
  return n;
};

export const prepareDmetaData = data => {
  let ret = [];
  if (data.data && data.data.data) {
    ret = data.data.data;
  }
  return ret;
};

//prepare datatables input
//columns: [{"title":"id"}, {"title":"name"}]
//data: [["123","John Doe Fresno"],["124", "Alice Alicia"]]
export const tsvCsvDatatablePrep = (tsvCsv, fixHeader, sep) => {
  if (!tsvCsv) return '';
  var result = { columns: [], data: [] };
  var cols = result.columns;
  var data = result.data;
  var tsvCsv = $.trim(tsvCsv);
  var lines = tsvCsv.split('\n');
  if (fixHeader) {
    lines[0] = lines[0].replace(/\./g, '_');
  }
  var headers = lines[0].split(sep);
  for (var i = 0; i < headers.length; i++) {
    cols.push({ title: headers[i] });
  }
  for (var i = 1; i < lines.length; i++) {
    var currentline = lines[i].split(sep);
    data.push(currentline);
  }
  console.log(result);
  return result;
};

// prepare dmeta output collections for datatables
// Additional header names: Run Info, Files
// input data:  [{"Run Info":"run name"}, {"Run Info":"run name", "Files":3}, {"total_cells":10, "total_reads":100}]
//columns: [{"title":"id"}, {"title":"name"}]
//data: [["123","John Doe Fresno"],["124", "Alice Alicia"]]
export const dmetaOutDatatablePrep = dmeta => {
  const fixHeader = true;
  const plusButton = true;
  if (!dmeta) return '';
  let result = { columns: [], data: [] };
  let cols = result.columns;
  let data = result.data;
  // get all column headers of the input data
  let allColumns = [];
  for (var i = 0; i < dmeta.length; i++) {
    const keys = Object.keys(dmeta[i]);
    allColumns = allColumns.concat(keys.filter(item => allColumns.indexOf(item) < 0));
  }
  // re-order 'Run Info', 'Files' to the beggining of the array
  let reOrderCols = ['Run Info', 'Files'];
  reOrderCols.reverse();
  for (var i = 0; i < reOrderCols.length; i++) {
    const index = allColumns.indexOf(reOrderCols[i]);
    if (index > -1) {
      allColumns.splice(index, 1);
      allColumns.unshift(reOrderCols[i]);
    }
  }
  if (fixHeader) {
    allColumns = allColumns.map(item => {
      return item.replace(/\./g, '_');
    });
  }
  if (plusButton) {
    allColumns.unshift('$plusButton');
  }

  for (var i = 0; i < allColumns.length; i++) {
    if (allColumns[i] == '$plusButton') {
      cols.push({
        className: 'outdetails-control',
        orderable: false,
        data: null,
        defaultContent: '<i class="cil-plus"></i>'
      });
    } else {
      cols.push({ title: allColumns[i] });
    }
  }
  for (var i = 0; i < dmeta.length; i++) {
    let arr = [];
    for (var k = 0; k < allColumns.length; k++) {
      let push = '';
      if (dmeta[i][allColumns[k]]) {
        push = dmeta[i][allColumns[k]];
      }
      arr.push(push);
    }
    data.push(arr);
  }
  return result;
};

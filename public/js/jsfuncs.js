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
  return result;
};

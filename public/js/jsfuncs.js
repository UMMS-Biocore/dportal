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

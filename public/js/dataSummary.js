/* eslint-disable */
let $scope = {};
$scope.dmeta_summary = {};

// returns summary object
// { 'Skin': { "Healthy": 3, "Lesional": 10}}
export const createDataSummary = function(data, fields) {
  for (var i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (!$scope.dmeta_summary[field]) {
      let lookup = {};
      for (var k = 0; k < data.length; k++) {
        if (data[k][field]) {
          const value = data[k][field];
          if (!lookup[value]) {
            lookup[value] = 1;
          } else {
            lookup[value]++;
          }
        }
      }
      $scope.dmeta_summary[field] = lookup;
    }
  }
  return $scope.dmeta_summary;
};

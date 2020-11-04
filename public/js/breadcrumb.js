/* eslint-disable */
import { createDataSummary } from './dataSummary';

export const prepareBreadcrumb = function(data) {
  const sumData = createDataSummary(data, ['experiment_series', 'experiment']);
  const sample_num = data.length;
  const exp_series_num = Object.keys(sumData['experiment_series']).length;
  const exp_num = Object.keys(sumData['experiment']).length;
  document.getElementById('exp_series_num').textContent = exp_series_num;
  document.getElementById('exp_num').textContent = exp_num;
  document.getElementById('samples_num').textContent = sample_num;
  $('.breadcrumb').css('display', 'inline-flex');
};

/* eslint-disable */
import { getDmetaColumns } from './dmetaTable';
import { createDataSummary } from './dataSummary';
import Chart from 'chart.js';
import 'chartjs-plugin-colorschemes';
// GLOBAL SCOPE
let $scope = {};
$scope.dmeta_summary = {};

const createSingleDatasetBarGraph = (barLabels, xLabel, yLabel, data, colorSchema, chartId) => {
  var ctx = document.getElementById(chartId);
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: barLabels,
      datasets: [
        {
          data: data,
          backgroundColor: Chart['colorschemes'].tableau[colorSchema],
          maxBarThickness: 80
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5
            },
            scaleLabel: {
              display: true,
              labelString: yLabel
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: xLabel
            }
          }
        ]
      }
    }
  });
};

export const prepareBarGraph = async function(data, options) {
  const sum = await createDataSummary(data, [options.dataCol]);
  //   console.log(getDmetaColumns());
  if (sum[options.dataCol]) {
    const barLabels = Object.keys(sum[options.dataCol]);
    const bardata = Object.values(sum[options.dataCol]);
    const xLabel = options.xLabel;
    const yLabel = options.yLabel;
    const colorSchema = options.colorSchema;
    createSingleDatasetBarGraph(barLabels, xLabel, yLabel, bardata, colorSchema, options.chartId);
  }
};

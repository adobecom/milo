import { makeRelative } from '../../utils/utils.js';

function processDataset(data) {
  const dataset = {};

  // Remove group and unit from headers
  const headers = Object.keys(data[0]).filter(header =>
    header.toLowerCase() !== 'unit' && header.toLowerCase() !== 'group'
  );
  dataset.source = [headers];

  // Use headers to set source
  data.forEach(element => {
    const values = headers.map((column) => element[column]);
    dataset.source.push(values);
  });

  return dataset;
}

function processSeries(data) {
  const series = [];
  // TODO: Series data
  return series;
}

/**
 * Return data as object with two entries
 */
async function fetchData(link) {
  const path = makeRelative(link.href);
  const data = {};
  const resp = await fetch(path.toLowerCase());
  if (!resp.ok) return;
  const json = await resp.json();

  // Check the type of data
  if (json[':type'] == 'multi-sheet') {
    const dataSheet = json[':names'][0];
    const seriesSheet = json[':names'][1];
    data.data = json[dataSheet]?.data;
    data.series = json[seriesSheet]?.data;
  } else {
    data.data = json.data;
    data.series = [];
  }

  return data;
}

export default async function init(el) {
  const link = el.querySelector('a[href$="json"]');
  if (!link) return;

  const data = await fetchData(link);
  if (!data) return;

  const dataSet = processDataset(data.data);
  const series = processSeries(data);
  const unit = data?.data[0]?.Unit;

  // TODO: Create Chart
  const chart = document.createElement('pre');
  chart.textContent = JSON.stringify(dataSet, null, 2);

  link.replaceWith(chart);
}

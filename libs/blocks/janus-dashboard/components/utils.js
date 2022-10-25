import { EXPECTED, envs } from './constants.js';

export function filterByTeam(flattened, team) {
  if (!team) return flattened;
  return flattened.filter((test) => test.search.team === team);
}

export function filterByFeature(flattened, feature) {
  if (!feature) return flattened;
  return flattened.filter((test) => test.search.feature === feature);
}

export function filterByStatus(flattened, status) {
  if (!status) return flattened;
  return flattened.filter((test) => test.search.status === status);
}

export function preprocessTestResults(results) {
  const consumers = Object.keys(envs).map((e) => /^@(.*)/.exec(e)[1]);
  const consumerSet = new Set(consumers);
  const testedBlocks = results.suites;
  const mapByConsumer = {};
  const mapByFeature = {};
  const flattened = [];
  const cntMapByConsumer = {};
  const cntMapByFeature = {};
  let totalCnt = 0;
  let totalFailedCnt = 0;
  let totalPassedCnt = 0;
  testedBlocks.forEach((block) => {
    // nala/features/columns.spec.js
    block.suites.forEach((feature) => {
      const featureName = feature.title;

      feature.specs.forEach((spec) => {
        spec.tests.forEach((test) => {
          spec.tags.forEach((tag) => {
            if (!consumerSet.has(tag)) return; // ignore other tags

            // add to flattened array
            test.search = {
              feature: featureName,
              team: tag,
              status: test.status === EXPECTED ? 'passed' : 'failed',
            };
            // append spec info
            test.title = spec.title;
            test.file = spec.file;
            test.tags = spec.tags;
            flattened.push(test);

            // add to mapByConsumer
            if (!(tag in mapByConsumer)) {
              mapByConsumer[tag] = {};
              cntMapByConsumer[tag] = {};
            }
            if (!(featureName in mapByConsumer[tag])) {
              mapByConsumer[tag][featureName] = [];
              cntMapByConsumer[tag][featureName] = {
                total: 0,
                passed: 0,
                failed: 0,
              };
            }
            mapByConsumer[tag][featureName].push(test);

            // add to mapByFeature
            if (!(featureName in mapByFeature)) {
              mapByFeature[featureName] = {};
              cntMapByFeature[featureName] = {};
            }
            if (!(tag in mapByFeature[featureName])) {
              mapByFeature[featureName][tag] = [];
              cntMapByFeature[featureName][tag] = {
                total: 0,
                passed: 0,
                failed: 0,
              };
            }
            mapByFeature[featureName][tag].push(test);

            cntMapByFeature[featureName][tag].total += 1;
            cntMapByConsumer[tag][featureName].total += 1;
            totalCnt += 1;
            if (test.status === EXPECTED) {
              cntMapByFeature[featureName][tag].passed += 1;
              cntMapByConsumer[tag][featureName].passed += 1;
              totalPassedCnt += 1;
            } else {
              cntMapByConsumer[tag][featureName].failed += 1;
              cntMapByFeature[featureName][tag].failed += 1;
              totalFailedCnt += 1;
            }
          });
        });
      });
    });
  });
  return {
    mapByConsumer,
    mapByFeature,
    cntMapByConsumer,
    cntMapByFeature,
    totalCnt,
    totalPassedCnt,
    totalFailedCnt,
    flattened,
  };
}

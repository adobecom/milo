import fs from 'fs';
import path from 'path';

const stateDir = 'preview-indexer/state';
const files = {
  regular: path.join(stateDir, 'last-runs.json'),
  sp: path.join(stateDir, 'last-runs-sp.json'),
};

// Ensure state directory exists
if (!fs.existsSync(stateDir)) {
  fs.mkdirSync(stateDir, { recursive: true });
}

async function loadState(isSp = false) {
  const file = isSp ? files.sp : files.regular;
  if (fs.existsSync(file)) {
    try {
      const raw = fs.readFileSync(file, 'utf8').trim();
      const stateJson = raw ? JSON.parse(raw) : {};
      return stateJson;
    } catch (err) {
      console.error('Error reading state file:', err);
    }
  }
  return {};
}

export async function saveLastRuns(siteRepo, lastRunInfo, isSp = false) {
  const file = isSp ? files.sp : files.regular;
  const state = await loadState(isSp);
  state[siteRepo] = lastRunInfo;
  try {
    fs.writeFileSync(file, JSON.stringify(state, null, 2));
    console.debug(`State written to ${file} with ${JSON.stringify(state)}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

const cachedState = { regular: null, sp: null };
export async function getLastRunInfo(ownerAndRepo, isSp = false) {
  const cacheKey = isSp ? 'sp' : 'regular';
  if (!cachedState[cacheKey]) {
    cachedState[cacheKey] = await loadState(isSp);
  }
  return cachedState[cacheKey][ownerAndRepo];
}

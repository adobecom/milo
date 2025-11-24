import fs from 'fs';
import path from 'path';

const file = 'preview-indexer/state/last-runs.json';
const dir = path.dirname(file);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function loadState() {
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

export async function saveLastRuns(siteRepo, lastRunInfo) {
  const state = await loadState();
  state[siteRepo] = lastRunInfo;
  try {
    fs.writeFileSync(file, JSON.stringify(state, null, 2));
    console.debug(`State written to ${file} with ${JSON.stringify(state)}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

let cachedState = null;
export async function getLastRunInfo(ownerAndRepo) {
  if (!cachedState) {
    cachedState = await loadState();
  }
  return cachedState[ownerAndRepo];
}

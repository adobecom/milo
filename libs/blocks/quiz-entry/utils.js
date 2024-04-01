import { getNormalizedMetadata } from '../quiz/utils.js';

export async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

export async function getQuizJson(path) {
  try {
    const [questions, strings] = await Promise.all(
      [fetchJson(`${path}questions.json`), fetchJson(`${path}strings.json`)],
    );
    return [questions, strings];
  } catch (ex) {
    window.lana?.log(`ERROR: Fetching data for quiz entry ${ex}`);
  }
  return [];
}

export function getQuizEntryData(el) {
  const blockData = getNormalizedMetadata(el);
  const dataPath = blockData.data.text;
  const quizPath = blockData.quiz.text;
  const analyticsType = blockData.analyticstype?.text;
  const analyticsQuiz = blockData.analyticsquiz?.text;
  return { quizPath, analyticsQuiz, analyticsType, dataPath };
}

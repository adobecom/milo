import { getConfig } from '../../utils/utils.js';

const API_KEY = 'CCHomeWeb1';
const ENDPOINT = 'community-recom-v1';

const getQuizTutorialsList = async (inputText, fiCode, numOfItems) => {
  const { env } = getConfig();
  const subdomain = env === 'prod' ? 'cchome-stage' : 'cchome-stage';
  const apiUrl = `https://${subdomain}.adobe.io/int/v1/models`;
  const result = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: ENDPOINT,
      contentType: 'application/json',
      payload: {
        data: {
          input: inputText,
          metadata_importance: 0,
          fi_code: fiCode,
          cleaning: 'no',
          num_items: numOfItems,
        },
      },
    }),
  })
    .then((response) => response.json())
    .catch((error) => window.lana.log(`ERROR: Fetching tutorials by fiCode ${error}`));

  return result;
};

const getQuizTutorialsDetails = async (
  inputText,
  fiCode,
  numOfItems,
) => {
  const tutorialsList = await getQuizTutorialsList(
    inputText,
    fiCode,
    numOfItems,
  );

  const contentIds = tutorialsList.data.map((item) => item.content_id);

  const baseUrl = 'https://utut-service.adobe.com/api/ututs';
  const queryParams = new URLSearchParams({
    api_key: 'CCHomeMLRepo1',
    ignore_missing_tutorials: 'true',
    locale: 'en_US',
  });

  contentIds.forEach((contentId) => {
    queryParams.append('aem_id', contentId);
  });

  const res = await fetch(`${baseUrl}?${queryParams.toString()}`)
    .then((response) => response.json())
    .catch((error) => console.log('Error:', error));
  return res;
};

export default getQuizTutorialsDetails;

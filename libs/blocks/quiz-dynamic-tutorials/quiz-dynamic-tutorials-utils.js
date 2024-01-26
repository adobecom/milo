import { getConfig } from '../../utils/utils.js';

const API_KEY = 'CCHomeWeb1';
const ENDPOINT = 'community-recom-v1';
const UTUA_API_KEY = 'CCPlanReco1';

const { env, locale } = getConfig();

const getQuizTutorialsList = async (inputText, fiCode, numOfItems) => {
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
  const subdomain = env === 'prod' ? 'utut-service' : 'utut-service-stage';

  const baseUrl = `https://${subdomain}.adobe.io/api/ututs`;
  const queryParams = new URLSearchParams({
    api_key: UTUA_API_KEY,
    ignore_missing_tutorials: 'true',
    locale: locale?.ietf.replace('-', '_'),
  });

  contentIds.forEach((contentId) => {
    queryParams.append('aem_id', contentId);
  });

  const result = await fetch(`${baseUrl}?${queryParams.toString()}`)
    .then((response) => response.json())
    .catch((error) => window.lana.log(`ERROR: Fetching tutorial by contentId ${error}`));
  return result;
};

export default getQuizTutorialsDetails;

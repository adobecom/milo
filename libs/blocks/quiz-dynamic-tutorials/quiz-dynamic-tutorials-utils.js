const getQuizTutorialsList = async (inputText, fiCode, numOfItems) => {
  const apiUrl = 'https://cchome-stage.adobe.io/int/v1/models';
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'x-api-key': 'CCHomeWeb1',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: 'community-recom-v1',
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
    .catch((error) => console.log('Error:', error));

  return res;
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

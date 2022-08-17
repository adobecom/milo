const getDate = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Date().toISOString().replace(/[TZ]/g, ' ').split('.')[0].trim();

const sendHelixData = ({ comment, lang, rating, postUrl, visitorId } = {}) => {
  const data = [
    { name: 'Timestamp', value: getDate() },
    { name: 'Rating', value: rating },
  ];

  if (comment) {
    data.push({ name: 'Comment', value: comment });
  }

  if (lang) {
    data.push({ name: 'Locale', value: lang });
  }

  if (visitorId) {
    data.push({ name: 'VisitorId', value: visitorId });
  }

  const body = { data };

  fetch(postUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

export default sendHelixData;

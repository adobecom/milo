export const SEOTECH_API_URL_PROD = 'https://14257-seotech.adobeioruntime.net/api/v1/web/seotech';
export const SEOTECH_API_URL_STAGE = 'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech';

// TODO: Fix how API URL is selected
export async function getVideoObject(url, seotechApiUrl = SEOTECH_API_URL_PROD) {
  const videosUrl = `${seotechApiUrl}/getVideoObject?url=${url}`;
  const resp = await fetch(videosUrl, { headers: { 'Content-Type': 'application/json' } });
  if (!resp) {
    return null;
  }
  if (resp.ok) {
    const body = await resp.json();
    return body.videoObject;
  }
  return null;
}

export default async function appendVideoObjectScriptTag(url, { createTag }) {
  const obj = await getVideoObject(url);
  if (!obj) return;
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(obj));
  document.head.append(script);
}

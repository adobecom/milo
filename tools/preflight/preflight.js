/* eslint-disable no-alert */
const isValidURL = (s) => {
  try {
    URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

async function httpsLinks() {
  const isHttp = (link) => link.href.includes('http:');
  const httpLinkCount = [...document.links].filter(isHttp).length;
  const result = httpLinkCount > 0
    ? `Http Link Count ${httpLinkCount}`
    : 'Good';
  return result;
}

async function checkH1s() {
  const h1s = document.querySelectorAll('h1');
  let result;
  if (h1s.length === 1) {
    result = 'Good';
  } else if (h1s.length > 1) {
    result = 'Multiple H1s';
    alert('Multiple H1s');
  } else if (h1s.length < 1) {
    result = 'Missing H1s';
    alert('Missing H1');
  }
  return result;
}

async function deprecatedTagCheck() {
  const deprecatedTags = 'basefront,font,center,strike,big,dir,isindex,applet,acronym,noframe,xmp,noembed,plaintext,frameset,frame,u,tt,s';
  let result;
  const tags = [...document.querySelectorAll(deprecatedTags)].map((el) => el.tagName);
  if (tags.length) {
    const foundTags = [...new Set(tags)];
    result = `Found Tag ${foundTags} Amount of Uses ${tags.length}`;
    alert(`Found deprecated tag ${foundTags}`);
  } else {
    result = 'None';
  }
  return result;
}

async function testTitle() {
  const titles = document.querySelectorAll('title');
  let result;
  if (titles.length < 1) {
    result = 'No title';
    alert('No title');
  } else {
    const titleSize = document.title.replace(/\s/g, '').length;
    if (titleSize < 15) {
      result = 'Too Short';
      alert('Title too short');
    } else if (titleSize > 70) {
      result = 'Too Long';
      alert('Title too long');
    } else {
      result = 'Good';
    }
  }
  return result;
}

async function canonURLTest() {
  const canon = document.querySelectorAll("link[rel='canonical']");
  let result;
  if (canon.length === 1) {
    const r2 = await fetch(
      document.querySelector("link[rel='canonical']").href,
    );
    if (r2.status >= 400) {
      result = 'Canon link broken';
      alert('Canononical link broken');
    } else if (r2.status >= 300) {
      result = 'Canon link redirects';
      alert('Canononical redirects');
    } else {
      result = 'Good';
    }
  } else {
    result = 'Incorrect amount of Canonical Urls';
    alert('Too many Canononical Urls');
  }
  return result;
}

async function metaDescriptionTest() {
  let result;
  const metaD = document.querySelectorAll('meta[name="description"]');
  const metadSize = metaD[0].content.replace(/\s/g, '').length;
  if (metaD.length < 1) {
    result = 'Missing';
    alert('Missing Meta Description');
  } else if (metaD.length === 1) {
    if (metadSize < 50 || metadSize > 150) {
      result = 'Incorrect Size';
      alert('Incorrect Meta Description size');
    } else {
      result = 'Good';
    }
  } else if (metaD.length > 1) {
    result = `More than one metadescription :${metaD.length}`;
    alert('More than one Meta description');
  }
  return result;
}

async function bodyLength() {
  let result;
  if (document.querySelectorAll('div[class="content"]').length > 0) {
    const text = document
      .getElementsByClassName('content')[0]
      .innerText.replace(/\s/g, '').length;
    result = text < 100 ? `Too little content in body ${text}` : 'Body content is Sufficent';
  } else {
    result = 'No body';
  }
  return result;
}

async function loremIpsumTest() {
  const { body } = document;
  let result;
  const textContent = body.textContent || body.innerText;
  if (textContent.includes('Lorem ipsum')) {
    result = 'Contains Lorem ipsum';
    alert('Contains Lorem Ipsum');
  } else {
    result = 'No Lorem ipsum';
  }
  return result;
}

(async function preflight() {
  const hrefLang = document.querySelectorAll('a[hreflang]');
  const refresh = document.querySelectorAll('meta[http-equiv="refresh"]');
  const charset = document.querySelectorAll('meta[charset]');
  const robotIndex = document.querySelector('meta[name="robots"]').getAttribute('content');
  const node = document.doctype;

  const data = {
    url: window.location.href,
    H1: await checkH1s(),
    httpsLinks: await httpsLinks(),
    depracatedTags: await deprecatedTagCheck(),
    title: await testTitle(),
    canon: await canonURLTest(),
    metaDescription: await metaDescriptionTest(),
    loremIpsum: await loremIpsumTest(),
    bodyLength: await bodyLength(),
    https: window.location.protocol !== 'Https:' ? 'Http' : 'Https',
    dateTime: new Date().toLocaleString(),
    validUrl: isValidURL(window.location.protocol) ? 'Valid' : 'Invalid',
    hreflang: hrefLang.length ? 'Has Hreflang' : 'No HrefLang',
    refresh: refresh.length ? 'Contains Meta refresh' : 'No Meta refresh',
    charset: charset.length ? 'Contains Charset' : 'No Charset',
    robotsIndex: robotIndex === 'index, follow' ? `Indexed ${robotIndex}` : (`Blocked ${robotIndex}`, alert('Robots blocked')),
  };

  // Testing for DOCTYPE
  data.docType = node.name
    + (node.publicId ? ` PUBLIC "${node.publicId}"` : '')
    + (!node.publicId && node.systemId ? ' SYSTEM' : '')
    + (node.systemId ? ` "${node.systemId}"` : '');

  await fetch(
    'https://main--milo--adobecom.hlx.page/seo/preflight',
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ data }),
    },
  );
}());

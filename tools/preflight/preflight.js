const validURL = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

async function uniq(a) {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

async function https2http(data) {
  var arr2 = [],
    l = document.links;
  for (var i = 0; i < l.length; i++) {
    arr2.push(l[i].href);
  }
  const checker = (value) =>
    ['http:'].some((element) => value.includes(element));
  data.https2Http =
    arr2.filter(checker).length > 0
      ? 'Http Link Count' + ' ' + arr2.filter(checker).length
      : 'Good';
}

(async function preflight() {
  const data = {
    url: window.location.href,
  };
  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 1) {
    data.H1 = 'True';
  } else if (h1s.length > 1) {
    data.H1 = 'Multiple H1';
    alert('Multiple H1');
  } else if (h1s.length < 1) {
    data.H1 = 'Missing H1';
    alert('Missing H1');
  }

  data.https = window.location.protocol != 'Https:' ? 'Http' : 'Https';
  data.dateTime = new Date().toLocaleString();

  const test = await https2http(data);
  //Testing for DOCTYPE
  var node = document.doctype;
  var html =
    node.name +
    (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') +
    (!node.publicId && node.systemId ? ' SYSTEM' : '') +
    (node.systemId ? ' "' + node.systemId + '"' : '');
  data.docType = html;

  //Testing for title
  const titles = document.querySelectorAll('title');
  if (titles.length < 1) {
    data.title = 'No title';
    alert('No title');
  } else {
    const titleSize = document.title.replace(/\s/g, '').length;
    if (titleSize < 15) {
      data.title = 'Too Short';
      alert('Title too short');
    } else if (titleSize > 70) {
      data.title = 'Too Long';
      alert('Title too long');
    } else {
      data.title = 'Good';
    }
  }

  //Testing for Canonical Url
  const canon = document.querySelectorAll("link[rel='canonical']");
  if (canon.length == 1) {
    const r2 = await fetch(
      document.querySelector("link[rel='canonical']").href
    );
    if (r2.status >= 400) {
      data.canon = 'Canon link broken';
      alert('Canononical link broken');
    } else if (r2.status >= 300) {
      data.canon = 'Canon link redirects';
      alert('Canononical redirects');
    } else {
      data.canon = 'Good';
    }
  } else {
    data.canon = 'Incorrect amount of Canonical Urls';
    alert('Too many Canononical Urls');
  }

  data.validUrl = validURL(window.location.protocol) ? 'Valid':'Invalid';
  
  //Test for Depracated tags
  let dep;
  let dep2 = [];
  let foundTag = [];
  dep = document.querySelectorAll(
    'basefront,font,center,strike,big,dir,isindex,applet,acronym,noframe,xmp,noembed,plaintext,frameset,frame,u,tt,s'
  );
  dep.forEach((element) => dep2.push(element.tagName));
  foundTag = await uniq(dep2);
  if (dep.length > 0) {
    data.depracatedTags =
      'Found Tag' + ' ' + foundTag + ' ' + 'Amount of Uses' + ' ' + dep.length;
    alert('Found depracated tag' + ' ' + foundTag);
  } else {
    data.depracatedTags = 'None';
  }

  //Meta description test
  let metaD = document.querySelectorAll('meta[name="description"]');
  let metadSize = metaD[0].content.replace(/\s/g, '').length;
  if (metaD.length < 1) {
    data.metaDescription = 'Missing';
    alert('Missing Meta Description');
  } else if (metaD.length === 1) {
    if (metadSize < 50 || metadSize > 150) {
      data.metaDescription = 'Incorrect Size';
      alert('Incorrect Meta Description size');
    } else {
      data.metaDescription = 'Good';
    }
  } else if (metaD.length > 1) {
    data.metaDescription = 'More than one metadescription :' + metaD.length;
    alert('More than one Meta description');
  }

  let hrefLang = document.querySelectorAll('a[hreflang]');
  data.hreflang = hrefLang.length > 0 ? 'Has Hreflang' : 'No HrefLang';

  let refresh = document.querySelectorAll('meta[http-equiv="refresh"]');
  data.refresh =
    refresh.length > 0 ? 'Contains Meta refresh' : 'No Meta refresh';

  let charset = document.querySelectorAll('meta[charset]');
  data.charset = charset.length > 0 ? 'Contains Charset' : 'No Charset';

  //test for robots
  let robotIndex = document
    .querySelector('meta[name="robots"]')
    .getAttribute('content');

  data.robotsIndex =
    robotIndex === 'index, follow'
      ? 'Indexed' + ' ' + robotIndex
      : ('Blocked' + ' ' + robotIndex, alert('Robots blocked'));

  //special character test
  var body = document.body;
  var textContent = body.textContent || body.innerText;
  if (textContent.includes('Lorem ipsum')) {
    data.loremIpsum = 'Contains Lorem ipsum';
    alert('Contains Lorem Ipsum');
  } else {
    data.loremIpsum = 'No Lorem ipsum';
  }

  if(document.querySelectorAll('div[class="content"]').length > 0){
  var text = document
    .getElementsByClassName('content')[0]
    .innerText.replace(/\s/g, '').length;
  data.bodyLength =
    text < 100
      ? 'Too little content in body' + ' ' + text
      : 'Body content is Sufficent';
  } else {
    data.bodyLength = "No body"
  }
  //status code test
  const r = await fetch(window.location.href);
  data.statusCode = r.status;
  const resp = await fetch(
    'https://main--milo--adobecom.hlx.page/seo/preflight',
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ data }), // body data type must match "Content-Type" header/
    }
  );
})();

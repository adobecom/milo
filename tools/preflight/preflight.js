function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!pattern.test(str);
}
function containsSpecialChars(str) {
  const specialChars = /[`@#$%^*()~+=]/;
  return specialChars.test(str);
}
//currently not being used will be used after cors fix
async function getLinks() {
  var urls = []
  for (var i = document.links.length; i-- > 0;) {
    if (document.links[i].hostname === location.hostname)
      urls.push(document.links[i].href);
    var r = await fetch(document.links[i].href);
  }
  return urls
}

( async function preflight() {
  const h1s = document.querySelectorAll('h1');

  const data = {
    url: window.location.href,
  };
  if (h1s.length === 1) {
    data.H1 = 'True';
  } else if (h1s.length > 1) {
    data.H1 = 'Multiple H1';
    alert("Multiple H1")
  } else if (h1s.length < 1) {
    data.H1 = 'Missing H1';
    alert("Missing H1")

  }
  if (window.location.protocol != 'https:') {
    data.https = 'Http';
  } else {
    data.https = 'Https';
  }

  //Testing for DOCTYPE
  var node = document.doctype;
  var html = node.name
    + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
    + (!node.publicId && node.systemId ? ' SYSTEM' : '')
    + (node.systemId ? ' "' + node.systemId + '"' : '')
  data.docType = html

  //Testing for title
  const titleSize = document.title.replace(/\s/g, '').length;
  const titles = document.querySelectorAll('title');
  if (titles.length < 1) {
    data.Title = 'No title';
    alert("No title")
  } else {
    if (titleSize < 15) {
      data.Title = 'Too Short';
      alert("Title too short")
    } else if (titleSize > 70) {
      data.Title = 'Too Long';
      alert("Title too long")
    } else {
      data.Title = 'Good';
    }
  }

  //Testing for Canonical Url 
  const canon = document.querySelectorAll("link[rel='canonical']");
  if (canon.length == 1) {
    const r2 = await fetch(document.querySelector("link[rel='canonical']").href);
    if (r2.status >= 300) {
      data.Canon = "Canon link broken"
      alert("Canononical link broken")
    } else {
      data.Canon = "Good"
    }
  } else {
    data.Canon = 'Incorrect amount of Canonical Urls';
    alert("Too many Canononical Urls")
  }

  if (validURL(window.location.href)) {
    data.contentEncoding = 'Expected';
  } else {
    data.contentEncoding = 'Unexpected';
  }
  //Test for Depracated tags
  let amount = 0;
  let dep;
  let foundDepTag = [];
  let depTag = [
    'basefront',
    'font',
    'center',
    'strike',
    'big',
    'dir',
    'isindex',
    'applet',
    'acronym',
    'noframe',
    'xmp',
    'noembed',
    'plaintext',
    'frameset',
    'frame',
    'u',
    'tt',
    's',
  ];
  for (let i = 0; i < depTag.length; i++) {
    dep = document.querySelectorAll(depTag[i]);
    if (dep.length > 0) {
      foundDepTag.push(depTag[i]);
      amount++;
    }
    if (amount > 0) {
      data.depracatedTags = foundDepTag;
    } else {
      data.depracatedTags = 'None';
    }
  }

  //Meta description test
  let metaD = document.querySelectorAll('meta[name="description"]');
  let metadSize = metaD[0].content.replace(/\s/g, '').length
  if (metaD.length < 1) {
    data.MetaDescription = 'Missing';
    alert("Missing Meta Description")
  } else if (metaD.length === 1) {
    if (metadSize < 50 || metadSize > 150) {
      data.MetaDescription = 'Incorrect Size';
      alert("Incorrect Meta Description size")
    } else {
      data.MetaDescription = 'Good';
    }
  } else if (metaD.length > 1) {
    data.MetaDescription = 'More than one metadescription :' + metaD.length;
    alert("More than one Meta decription")
  }

  //test for robots
  let robotIndex = document
    .querySelector('meta[name="robots"]')
    .getAttribute('content');
  if (robotIndex === 'index, follow') {
    data.robotsIndex = 'Indexed' + ' ' + robotIndex;
  } else {
    data.robotsIndex = 'Blocked' + ' ' + robotIndex;
    alert("Robots blocked")
  }

  //special character test 
  data.validUrl = containsSpecialChars(window.location.href);

  var body = document.body;
  var textContent = body.textContent || body.innerText;
  if (textContent.includes("Lorem ipsum")) {
    data.loremIpsum = "Contains Lorem ipsum"
    alert("Contains Lorem Ipsum")
  } else {
    data.loremIpsum = "No Lorem ipsum"
  }

  //status code test
  const r = await fetch(window.location.href);
  data.statusCode = r.status


  const resp = await fetch('http://localhost:3000/seo/preflight', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({ data }), // body data type must match "Content-Type" header/
  });

  const json = await resp.json();
  console.log(json);
})();

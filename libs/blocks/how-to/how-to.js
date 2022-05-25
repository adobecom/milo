function loadJsonLd(el) {
  let howToSteps;
  howToSteps = [...el.querySelectorAll(':scope > div > div')].slice();
  const h1Content = howToSteps[0].innerHTML;
  const description = howToSteps[1].innerHTML;

  const h1 = document.createElement('h1');
  h1.innerHTML = h1Content;
  el.appendChild(h1);
  // give div an id of its h1 content
  const divId = h1Content.replace(/\s+/g, '-').toLowerCase();
  h1.id = divId;
  howToSteps[0].remove();
  howToSteps = howToSteps.slice(2);

  let stepsCount = 1;
  const step = [];
  const orderedList = document.createElement('ol');

  howToSteps.forEach((steps) => {
    const stepListItem = document.createElement('li');
    const stepListDiv = document.createElement('div');
    stepListDiv.innerHTML = steps.innerHTML;
    stepListItem.innerHTML = stepListDiv.outerHTML;
    orderedList.appendChild(stepListItem);
    step.push({
      '@type': 'HowToStep',
      url: `${window.location.href}#${divId}`,
      name: `Step ${stepsCount}`,
      text: step.innerHTML,
      itemListElement: [{
        '@type': 'HowToDirection',
        text: steps.innerHTML,
      }],
    });
    stepsCount += 1;
    steps.parentNode.remove();
  });
  el.appendChild(orderedList);
  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'HowTo',
    name: 'How to',
    description,
    publisher: {
      '@type': 'Organization',
      name: 'Adobe',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg',
      },
    },
    step,
  };

  if (description) {
    el.querySelector(':scope > div > div').parentNode.remove();
  }

  const jsonLdString = JSON.stringify(jsonLd);
  const jsonLdScript = document.createElement('script');
  jsonLdScript.type = 'application/ld+json';
  jsonLdScript.text = jsonLdString;
  document.getElementsByTagName('head')[0].appendChild(jsonLdScript);
}

export default function init(el) {
  loadJsonLd(el);
}

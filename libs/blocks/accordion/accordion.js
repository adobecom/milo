function loadJsonLd(el) {
  const faqEntries = [...el.querySelectorAll(':scope > div')].slice(1);
  const faqItems = [];
  faqEntries.forEach((faqEntry) => {
    const faqQuestion = faqEntry.querySelectorAll('div')[0];
    const faqAnswer = faqEntry.querySelectorAll('div')[1];
    faqItems.push({
      '@type': 'Question',
      name: faqQuestion.innerHTML,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqAnswer.innerHTML,
      },
    });
  });

  const jsonld = {
    '@context': 'http://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems,
  };

  const jsonLdString = JSON.stringify(jsonld);
  const jsonLdScript = document.createElement('script');
  jsonLdScript.type = 'application/ld+json';
  jsonLdScript.text = jsonLdString;
  document.getElementsByTagName('head')[0].appendChild(jsonLdScript);
}

function decorateHowTo(el) {
  const faqEntries = [...el.querySelectorAll(':scope > div')].slice(1);
  const accordionContainer = document.createElement('div');
  accordionContainer.classList.add('accordion');
  el.appendChild(accordionContainer);
  // move h1 to accordion container
  accordionContainer.appendChild(el.querySelectorAll(':scope > div > div')[0]);
  // move faq entries to accordion container
  faqEntries.forEach((faqEntry) => {
    accordionContainer.appendChild(faqEntry);
  });
  // remove h1 and faq entries from original element
  el.querySelectorAll(':scope > div > div')[0].parentNode.remove();
  faqEntries.forEach((faqEntry) => {
    faqEntry.parentNode.remove();
  });
  // add accordion to original element
  el.appendChild(accordionContainer);
  // build accordion out of faqEntries with buttons and add them to the DOM
  faqEntries.forEach((faqEntry) => {
    faqEntry.classList.add('accordion-item');
    const faqQuestion = faqEntry.querySelectorAll('div')[0];
    const faqAnswer = faqEntry.querySelectorAll('div')[1];
    const faqButton = document.createElement('button');
    faqAnswer.classList.add('accordion-panel');
    faqButton.classList.add('accordion-title');
    faqButton.innerHTML = faqQuestion.innerHTML;
    faqEntry.insertBefore(faqButton, faqQuestion);
    // add aria labels to buttons
    faqButton.setAttribute('aria-expanded', 'false');
    faqButton.setAttribute('aria-controls', faqAnswer.id);
    faqAnswer.setAttribute('aria-hidden', 'true');
    faqAnswer.setAttribute('aria-labelledby', faqButton.id);
    // add aria button role
    faqButton.setAttribute('role', 'button');
    // insert svg html before button
    const svg = document.createElement('div');
    svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18"><defs><style> .a { fill: #6E6E6E; } </style></defs><title>S ChevronDown 18 N</title><rect id="Canvas" fill="#333333" opacity="0" width="18" height="18" /><path class="a" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.4125,0L4.293,7.716A.9945.9945,0,0,1,4,7.01Z" /></svg>';
    // append svg before button
    faqButton.insertBefore(svg, faqButton.firstChild);
    faqQuestion.remove();
    faqButton.addEventListener('click', () => {
      faqAnswer.classList.toggle('panel-show');
      faqEntry.classList.toggle('panel-show');
      faqButton.setAttribute('aria-expanded', faqAnswer.classList.contains('panel-show'));
      faqAnswer.setAttribute('aria-hidden', !faqAnswer.classList.contains('panel-show'));
    });
  });

  const h1Content = el.querySelectorAll(':scope > div > div')[0].innerHTML;
  const h1 = document.createElement('h1');
  h1.innerHTML = h1Content;
  el.insertBefore(h1, el.firstChild);
  el.querySelector('.accordion > div > div').remove();
}

export default function init(el) {
  loadJsonLd(el);
  if (el.classList.contains('seo')) {
    decorateHowTo(el);
  }
}

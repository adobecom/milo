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
  document.head.append(jsonLdScript);
}

function decorateAccordion(el) {
  const divs = [...document.querySelectorAll('.accordion > div')].slice(1);
  // remove every 2 divs from dom an wrap in accordion item
  divs.forEach((div, index) => {
    if (index % 2 === 0) {
      const accordionItem = document.createElement('div');
      accordionItem.classList.add('accordion-item');
      div.parentNode.insertBefore(accordionItem, div);
      accordionItem.appendChild(div);
      const nextDiv = divs[index + 1];
      nextDiv.classList.add('accordion-panel');
      if (nextDiv) {
        accordionItem.appendChild(nextDiv);
      }
    }
  });

  const accordionItems = [...el.querySelectorAll('.accordion-item')];
  const accordionContainer = document.createElement('div');
  accordionContainer.classList.add('accordion');
  el.appendChild(accordionContainer);
  accordionContainer.appendChild(el.querySelectorAll(':scope > div > div')[0]);
  accordionItems.forEach((accordionItem) => {
    accordionContainer.appendChild(accordionItem);
  });
  // remove h2 and faq entries from original element
  el.querySelectorAll(':scope > div > div')[0].parentNode.remove();
  accordionItems.forEach((accordionItem) => {
    accordionItem.parentNode.remove();
  });
  // add accordion to original element
  el.appendChild(accordionContainer);
  // build accordion out of accordionItems with buttons and add them to the DOM
  accordionItems.forEach((accordionItem) => {
    // accordionItem.classList.add('accordion-item');
    const accordionTitleContent = accordionItem.querySelectorAll('div')[0];
    const accordionPanel = accordionItem.querySelectorAll('div')[1];
    const accordionTitle = document.createElement('button');
    // accordionPanel.classList.add('accordion-panel');
    // accordionTitle.classList.add('accordion-title');
    accordionTitle.innerHTML = accordionTitleContent.innerHTML;
    accordionItem.insertBefore(accordionTitle, accordionTitleContent);
    // add aria labels to buttons
    accordionTitle.setAttribute('aria-expanded', 'false');
    accordionTitle.setAttribute('aria-controls', accordionPanel.id);
    accordionPanel.setAttribute('aria-hidden', 'true');
    accordionPanel.setAttribute('aria-labelledby', accordionTitle.id);
    // add aria button role
    accordionTitle.setAttribute('role', 'button');
    // insert svg html before button
    const svg = document.createElement('div');
    svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18"><defs><style> .a { fill: #6E6E6E; } </style></defs><title>S ChevronDown 18 N</title><rect id="Canvas" fill="#333333" opacity="0" width="18" height="18" /><path class="a" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.4125,0L4.293,7.716A.9945.9945,0,0,1,4,7.01Z" /></svg>';
    // append svg before button
    accordionTitle.insertBefore(svg, accordionTitle.firstChild);
    accordionTitleContent.remove();
    accordionTitle.addEventListener('click', () => {
      accordionPanel.classList.toggle('panel-show');
      accordionItem.classList.toggle('panel-show');
      accordionTitle.setAttribute('aria-expanded', accordionPanel.classList.contains('panel-show'));
      accordionPanel.setAttribute('aria-hidden', !accordionPanel.classList.contains('panel-show'));
    });
  });

  const h2Content = el.querySelectorAll(':scope > div > div')[0].innerHTML;
  const h2 = document.createElement('h2');
  h2.innerHTML = h2Content;
  el.insertBefore(h2, el.firstChild);
  el.querySelector('.accordion > div > div').remove();
}

export default function init(el) {
  decorateAccordion(el);
  if (el.classList.contains('seo')) {
    loadJsonLd(el);
  }
}

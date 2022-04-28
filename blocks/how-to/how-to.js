function loadJsonLd(el) {
  // Check for image in first div of el.
  const firstImage = el.querySelectorAll(':scope > div > div')[0].querySelector('img');
  const firstImageJson = [];
  if (firstImage) {
    const firstImageWidth = firstImage.width;
    const firstImageHeight = firstImage.height;
    const imageUrl = firstImage.src;
    firstImageJson.push({
      '@type': 'ImageObject',
      url: imageUrl,
      height: firstImageWidth,
      width: firstImageHeight,
    });
  }
  let howToSteps;
  let description;
  // Check for inital image being used in how-to-steps
  if (firstImage) {
    // This has image and description.
    howToSteps = [...el.querySelectorAll(':scope > div > div')].slice(1);
    description = howToSteps[0].innerHTML;
  } else {
    // This has only description.
    howToSteps = [...el.querySelectorAll(':scope > div > div')].slice();
    description = howToSteps[0].innerHTML;
    howToSteps = howToSteps.slice(1);
  }

  // If the how-to-steps have images, filter the images out of the steps.
  if (el.querySelectorAll(':scope > div + div img')) {
    howToSteps = howToSteps.filter((element, index) => index % 2 === 0);
  }
  let stepsCount = 1;
  const steps = [];
  howToSteps.forEach((step) => {
    if (step.nextSibling !== null) {
      // Get current url.
      const stepImageSrc = step.nextSibling.querySelector('img').src;
      const stepImageHeight = step.nextSibling.querySelector('img').height;
      const stepImageWidth = step.nextSibling.querySelector('img').width;

      const currentUrl = window.location.href;
      const stepId = `step-${stepsCount}`;
      const stepUrl = `${currentUrl}#${stepId}`;
      if (stepImageSrc) {
        steps.push(
          {
            '@type': 'HowToStep',
            url: stepUrl,
            name: `Step ${stepsCount}`,
            text: step.innerHTML,
            image: {
              '@type': 'ImageObject',
              url: stepImageSrc,
              height: stepImageHeight,
              width: stepImageWidth,
            },
          },
        );
      }
    } else {
      steps.push({
        '@type': 'HowToStep',
        name: `Step ${stepsCount}`,
        text: step.innerHTML,
      });
    }
    stepsCount += 1;
  });

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
    image: firstImageJson,
    mainEntity: {
      '@type': 'HowToSection',
      name: 'How to',
      description,
      itemListElement: steps,
    },
  };

  const jsonLdString = JSON.stringify(jsonLd);
  const jsonLdScript = document.createElement('script');
  jsonLdScript.type = 'application/ld+json';
  jsonLdScript.text = jsonLdString;
  document.getElementsByTagName('head')[0].appendChild(jsonLdScript);
}

export default function init(el) {
  loadJsonLd(el);
}

function loadJsonLd(el) {

    // check for image in first div of el
    const firstImage = el.querySelectorAll(':scope > div > div')[0].querySelector('img');
    const firstImageJson = [];
    if (firstImage) {
        const firstImageWidth = firstImage.getAttribute('width');
        const firstImageHeight = firstImage.getAttribute('height');
        const imageUrl = firstImage.src;
        firstImageJson.push({
            "image": {
                "@type": "ImageObject",
                "url": imageUrl,
                "height": firstImageWidth,
                "width": firstImageHeight
            },
        });
    }
    const howToDescription = el.className.split(' ')[1].replaceAll('-', ' ');
    const howToSteps = el.querySelectorAll(':scope > div > div');
    let stepsCount = 1;
    let steps = [];
    howToSteps.forEach((step) => {
        if (step.nextSibling !== null) {
            // console.log('step.nextSibling');
            // console.log(step.nextSibling);     
            // console.log(step.nextSibling.querySelector('img'));
        }
        steps.push({
            '@type': 'HowToStep',
            'name': `Step ${stepsCount}`,
            'text': step.innerHTML,
        });
        stepsCount++;
    });
    console.log(firstImageJson);

    var jsonLd = {
        "@context": "http://schema.org",
        "@type": "HowTo",
        "name": "How to",
        "description": howToDescription,
        "publisher": {
            "@type": "Organization",
            "name": "Adobe",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg"
            }
        },
        firstImageJson,
        "mainEntity": {
            "@type": "HowToSection",
            "name": "How to",
            "description": howToDescription,
            "itemListElement": steps,
        }
    };

    var jsonLdString = JSON.stringify(jsonLd);
    var jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.text = jsonLdString;
    document.getElementsByTagName('head')[0].appendChild(jsonLdScript);
}
export default function init(el) {
    loadJsonLd(el);
}
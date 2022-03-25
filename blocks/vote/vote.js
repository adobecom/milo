function decorateRatings(el) {
  const ratingsEl = el.querySelector('h2 + p');
  const ratings = ratingsEl.textContent.split(' ');
  ratingsEl.remove();
  const ratingsHeader = document.createElement('div');
  ratingsHeader.className = 'ratings-header';
  const ratingsText = document.createElement('div');
  ratingsText.className = 'ratings-text';
  ratingsText.append(...ratings.map((text) => {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = text;
    return ratingEl;
  }));
  ratingsHeader.append(ratingsText);
  return ratingsHeader;
}

export default async function init(el) {
  // Setup Ratings Header
  const ratingsHeader = decorateRatings(el);



  const form = document.createElement('form');
  const resp = await fetch('names.json');
  const json = await resp.json();

  const choices = json.data.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  choices.forEach((choice) => {
    const { name, description } = choice;

    // Card
    const card = document.createElement('div');
    card.className = 'vote-card';

    // Text Container
    const text = document.createElement('div');
    text.className = 'text';

    // Label
    const title = document.createElement('h3');
    title.innerHTML = name;

    // Description
    const desc = document.createElement('p');
    desc.innerHTML = description;

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    const slider = document.createElement('input');
    slider.className = 'slider';
    slider.type = 'range';
    slider.setAttribute('min', -1);
    slider.setAttribute('value', 0);
    slider.setAttribute('max', 1);
    slider.id = name;
    slider.addEventListener('change', (e) => {
      slider.setAttribute('value', e.target.value);
    });
    sliderContainer.append(slider);

    text.append(title, desc);
    card.append(text, sliderContainer);
    form.append(card);
  });

  const send = document.createElement('button');
  send.textContent = 'Send';
  send.className = 'send-vote';

  // send.addEventListener('click', async (e) => {
  //   const mock = {
  //       data: {
  //           name: 'Chris Millar',
  //           email: 'cmillar@adobe.com',
  //       },
  //   };
  //   const resp = await fetch('/names', {
  //       method: 'POST',
  //       headers: {
  //           'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(mock),
  //   });
  //   const json = await resp.text();
  //   console.log(json);
  // });

  el.append(ratingsHeader, form, send);
}
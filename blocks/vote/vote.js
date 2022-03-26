import { loadScript } from '../../scripts/scripts.js';

const data = {};

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

async function imsReady() {
  const accessToken = window.adobeIMS.getAccessToken();
    if (accessToken) {
      const profile = await adobeIMS.getProfile();
      data.id = profile.userId;
      document.querySelector('.login').classList.add('hide');
      document.querySelector('.vote').classList.remove('hide');
    } else {
      window.adobeIMS.signIn();
    }
}

function loadIms(el) {
  window.adobeid = {
    client_id: 'wp4',
    scope: 'AdobeID,openid',
    locale: 'en_US',
    autoValidateToken: true,
    environment: 'stg1',
    useLocalStorage: false,
    onReady: () => { imsReady(el) },
  };
  loadScript('https://auth.services.adobe.com/imslib/imslib.min.js');
}

function buildRow(choice) {
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

  data[name] = 0;

  slider.addEventListener('change', (e) => {
    slider.setAttribute('value', e.target.value);
    data[name] = e.target.value;
  });
  sliderContainer.append(slider);

  text.append(title, desc);
  card.append(text, sliderContainer);
  return card;
}

function hasVoted() {
  return localStorage.getItem('voted');
}

function buildSend() {
  const send = document.createElement('button');
  send.textContent = 'Send';
  send.className = 'send-vote';

  send.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log(data);
    // const resp = await fetch('/names', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ data }),
    // });
    // if (resp.ok) {
    //   localStorage.setItem('voted', true);
    //   document.querySelector('.vote').classList.add('hide');
    //   document.querySelector('.voted').classList.remove('hide');
    // }
  });
  return send;
}

export default async function init(el) {
  el.classList.add('contained', 'hide');
  if (hasVoted()) {
    document.querySelector('.login').classList.add('hide');
    document.querySelector('.voted').classList.remove('hide');
  } else {
    loadIms(el);

    // Setup Ratings Header
    const ratingsHeader = decorateRatings(el);

    const form = document.createElement('form');
    const resp = await fetch('names.json');
    const json = await resp.json();

    // Randomize choices
    const choices = json.data.map(value =>
      ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    choices.forEach((choice) => {
      const row = buildRow(choice);
      form.append(row);
    });

    form.append(buildSend());
    el.append(ratingsHeader, form);
  }
}
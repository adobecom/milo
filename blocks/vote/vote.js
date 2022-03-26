import { loadScript } from '../../scripts/scripts.js';

const data = {};
const hello = [
  'Hello',
  'Hola',
  'Bonjour',
  'Guten tag',
  'Salve',
  '你好',
  'Olá',
  'Asalaam alaikum',
  'こんにちは',
  '안녕하세요'
];

function randomize(arr) {
  return arr.map(value =>
    ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function decorateRatings(el) {
  const ratingsEl = el.querySelector('h2 + p');
  const ratings = ratingsEl.textContent.split(' ');
  ratingsEl.remove();
  const header = document.createElement('div');
  header.className = 'ratings-header';
  const ratingsText = document.createElement('div');
  ratingsText.className = 'ratings-text';
  ratingsText.append(...ratings.map((text) => {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = text;
    return ratingEl;
  }));
  header.append(ratingsText);
  return header;
}

async function imsReady() {
  const accessToken = window.adobeIMS.getAccessToken();
    if (accessToken) {
      const profile = await adobeIMS.getProfile();
      data.id = profile.userId;
      document.querySelector('.login').classList.add('hide');
      document.querySelector('.vote').classList.remove('hide');
      
      const helloHead = document.createElement('h3');
      helloHead.innerText = `${randomize(hello)[0]} ${profile.displayName},`;
      console.log(randomize(hello));
      const p = document.querySelector('.vote p');
      p.parentNode.insertBefore(helloHead, p);
    } else {
      window.adobeIMS.signIn();
    }
}

function getEnv() {
  return window.location.hostname === 'main--wp4--adobecom.hlx.page' ? 'prod' : 'stg1';
}

function loadIms(el) {
  window.adobeid = {
    client_id: 'wp4',
    scope: 'AdobeID,openid',
    locale: 'en_US',
    autoValidateToken: true,
    environment: getEnv(),
    useLocalStorage: false,
    onReady: () => { imsReady(el) },
  };
  loadScript('https://auth.services.adobe.com/imslib/imslib.min.js');
}

function buildRow(choice) {
  const { name, description } = choice;
  data[name] = 0;

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

  // Slider
  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'slider-container';
  const slider = document.createElement('input');
  slider.className = 'slider';
  slider.id = name;
  slider.type = 'range';
  slider.setAttribute('min', -1);
  slider.setAttribute('value', 0);
  slider.setAttribute('max', 1);
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
    const resp = await fetch('/names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
    });
    if (resp.ok) {
      localStorage.setItem('voted', true);
      document.querySelector('.vote').remove();
      document.querySelector('.voted').classList.remove('hide');
    }
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
    const header = decorateRatings(el);

    const form = document.createElement('form');
    const resp = await fetch('names.json');
    const json = await resp.json();

    // Randomize choices
    const choices = randomize(json.data);

    choices.forEach((choice) => {
      const row = buildRow(choice);
      form.append(row);
    });

    form.append(buildSend());
    el.append(header, form);
  }
}
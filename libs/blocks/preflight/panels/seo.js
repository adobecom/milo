import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { STATUS } from '../checks/constants.js';
import preflightApi from '../checks/preflightApi.js';

const { runChecks } = preflightApi.seo;

const DEF_ICON = 'purple';
const DEF_DESC = 'Checking...';
const pass = 'green';
const fail = 'red';
const limbo = 'orange';

const h1Result = signal({ icon: DEF_ICON, title: 'H1 count', description: DEF_DESC });
const titleResult = signal({ icon: DEF_ICON, title: 'Title size', description: DEF_DESC });
const canonResult = signal({ icon: DEF_ICON, title: 'Canonical', description: DEF_DESC });
const descResult = signal({ icon: DEF_ICON, title: 'Meta description', description: DEF_DESC });
const bodyResult = signal({ icon: DEF_ICON, title: 'Body size', description: DEF_DESC });
const loremResult = signal({ icon: DEF_ICON, title: 'Lorem Ipsum', description: DEF_DESC });
const linksResult = signal({ icon: DEF_ICON, title: 'Links', description: DEF_DESC, details: { badLinks: [] } });

function toUIFormat(result, signalResult) {
  let icon;
  if (result.status === STATUS.PASS) {
    icon = pass;
  } else if (result.status === STATUS.LIMBO) {
    icon = limbo;
  } else {
    icon = fail; // Covers STATUS.FAIL and STATUS.EMPTY
  }

  signalResult.value = {
    icon,
    status: result.status,
    title: result.title,
    description: result.description,
    details: result.details,
  };
  return icon;
}

export async function sendResults() {
  const robots = document.querySelector('meta[name="robots"]').content || 'all';

  const data = {
    dateTime: new Date().toLocaleString(),
    url: window.location.href,
    H1: h1Result.value.description,
    httpsLinks: linksResult.value.description,
    title: titleResult.value.description,
    canon: canonResult.value.description,
    metaDescription: descResult.value.description,
    loremIpsum: loremResult.value.description,
    bodyLength: bodyResult.value.description,
    https: window.location.protocol === 'https:' ? 'HTTPS' : 'HTTP',
    robots,
  };

  await fetch(
    'https://main--milo--adobecom.aem.page/seo/preflight',
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ data }),
    },
  );
}

function SeoItem({ icon, title, description }) {
  return html`
    <div class=preflight-item>
      <div class="result-icon ${icon}"></div>
      <div class=preflight-item-text>
        <p class=preflight-item-title>${title}</p>
        <p class=preflight-item-description>${description}</p>
      </div>
    </div>`;
}

async function getResults() {
  const signals = [
    h1Result,
    titleResult,
    canonResult,
    descResult,
    bodyResult,
    loremResult,
    linksResult,
  ];

  const checks = runChecks(window.location.pathname);

  // Update UI as each check resolves
  const icons = [];
  const checkPromises = [];
  checks.forEach((resultOrPromise, index) => {
    const signalResult = signals[index];
    const promise = Promise.resolve(resultOrPromise)
      .then((result) => {
        const icon = toUIFormat(result, signalResult);
        icons[index] = icon;
      })
      .catch((error) => {
        const icon = toUIFormat(
          {
            title: signalResult.value.title,
            status: STATUS.FAIL,
            description: `Error running check: ${error.message}`,
          },
          signalResult,
        );
        icons[index] = icon;
      });
    checkPromises.push(promise);
  });

  await Promise.all(checkPromises);

  const red = icons.find((icon) => icon === 'red');
  if (!red) return;

  const aemSk = document.querySelector('aem-sidekick');
  const hlxSk = document.querySelector('helix-sidekick');
  if (!aemSk && !hlxSk) return;

  const publishBtn = aemSk
    ? aemSk.shadowRoot.querySelector('plugin-action-bar').shadowRoot.querySelector('sk-action-button.publish')
    : hlxSk.shadowRoot.querySelector('div.publish.plugin button');

  publishBtn.addEventListener('click', () => {
    sendResults();
  });
}

export default function SEO() {
  useEffect(() => { getResults(); }, []);
  return html`
    <div class=preflight-columns>
      <div class=preflight-column>
        <${SeoItem} icon=${titleResult.value.icon} title=${titleResult.value.title} description=${titleResult.value.description} />
        <${SeoItem} icon=${h1Result.value.icon} title=${h1Result.value.title} description=${h1Result.value.description} />
        <${SeoItem} icon=${canonResult.value.icon} title=${canonResult.value.title} description=${canonResult.value.description} />
        <${SeoItem} icon=${linksResult.value.icon} title=${linksResult.value.title} description=${linksResult.value.description} />
      </div>
      <div class=preflight-column>
        <${SeoItem} icon=${bodyResult.value.icon} title=${bodyResult.value.title} description=${bodyResult.value.description} />
        <${SeoItem} icon=${loremResult.value.icon} title=${loremResult.value.title} description=${loremResult.value.description} />
        <${SeoItem} icon=${descResult.value.icon} title=${descResult.value.title} description=${descResult.value.description} />
      </div>
    </div>
    <div class='problem-links'>
    ${linksResult.value.details.badLinks.length > 0 && html`
      <p class="note">Close preflight to see problem links highlighted on page.</p>
      <table>
        <tr>
          <th></th>
          <th>Problematic URLs</th>
          <th>Located in</th>
          <th>Status</th>
        </tr>
        ${linksResult.value.details.badLinks.map((link, idx) => html`
          <tr>
            <td>${idx + 1}.</td>
            <td><a href='${link?.liveHref}' target='_blank'>${link?.liveHref}</a></td>
            <td><span>${link?.parent}</span></td>
            <td><span>${link?.status}</span></td>
          </tr>`)}
      </table>`}
    </div>`;
}

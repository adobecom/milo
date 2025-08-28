import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { asoCache, getASOToken } from '../checks/asoApi.js';
import { SEO_IDS, SEO_TITLES, STATUS, ASO_TIMEOUT_MS, ASO_POLL_INTERVAL_MS } from '../checks/constants.js';
import { getChecksSuite, getPreflightResults } from '../checks/preflightApi.js';

const DEF_ICON = 'purple';
const DEF_DESC = 'Checking...';
const pass = 'green';
const fail = 'red';
const limbo = 'orange';

const h1Result = signal({
  id: SEO_IDS.h1Count,
  icon: DEF_ICON,
  title: SEO_TITLES.h1Count,
  description: DEF_DESC,
});
const titleResult = signal({
  id: SEO_IDS.title,
  icon: DEF_ICON,
  title: SEO_TITLES.title,
  description: DEF_DESC,
});
const canonResult = signal({
  id: SEO_IDS.canonical,
  icon: DEF_ICON,
  title: SEO_TITLES.canonical,
  description: DEF_DESC,
});
const descResult = signal({
  id: SEO_IDS.description,
  icon: DEF_ICON,
  title: SEO_TITLES.description,
  description: DEF_DESC,
});
const bodyResult = signal({
  id: SEO_IDS.bodySize,
  icon: DEF_ICON,
  title: SEO_TITLES.bodySize,
  description: DEF_DESC,
});
const loremResult = signal({
  id: SEO_IDS.loremIpsum,
  icon: DEF_ICON,
  title: SEO_TITLES.loremIpsum,
  description: DEF_DESC,
});
const linksResult = signal({
  id: SEO_IDS.links,
  icon: DEF_ICON,
  title: SEO_TITLES.links,
  description: DEF_DESC,
  details: { badLinks: [] },
});
const aiSuggestions = signal([]);
const authErrorMessage = signal('');
const asoSessionTrigger = signal(0);

const isAso = getChecksSuite() === 'ASO';

const signals = [
  h1Result,
  titleResult,
  canonResult,
  descResult,
  bodyResult,
  loremResult,
  linksResult,
];

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
    id: result.id,
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

function SeoItem({ id, icon, title, description, supportsAi }) {
  const aiSuggestion = aiSuggestions.value.find((suggestion) => suggestion.id === id)?.aiSuggestion;
  const showLoadingAi = isAso && supportsAi && icon === 'red' && !aiSuggestion;
  const showAiSuggestion = supportsAi && aiSuggestion && icon === 'red';
  return html`
    <div class=preflight-item>
      <div class="result-icon ${icon}"></div>
      <div class=preflight-item-text>
        <p class=preflight-item-title>${title}</p>
        <p class=preflight-item-description>${description}</p>
         ${showLoadingAi && html`<p class="ai-suggestion">AI suggestion: <div class="result-icon purple"></div></p>`}
        ${showAiSuggestion && html`<p class="ai-suggestion">AI suggestion: ${aiSuggestion}</p>`}
      </div>
    </div>`;
}

async function getResults() {
  const results = (await getPreflightResults(window.location.href, document)).runChecks.seo || [];

  // Update UI as each check resolves
  const icons = [];
  const checkPromises = [];
  results.forEach((resultOrPromise) => {
    const promise = Promise.resolve(resultOrPromise)
      .then((result) => {
        const targetSignal = signals.find((s) => s.value.id === result.id);
        const icon = toUIFormat(result, targetSignal);
        icons.push(icon);
      })
      .catch((error) => {
        const targetSignal = signals.find((s) => s.value.id === error.id);
        const icon = toUIFormat(
          {
            title: targetSignal.value.title,
            status: STATUS.FAIL,
            description: `Error running check: ${error.message}`,
          },
          targetSignal,
        );
        icons.push(icon);
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

async function handleAsoSignIn() {
  await window.asoIMS.signIn({ profile_filter: 'inc@AdobeOrg' });

  const sessionIntervalId = setInterval(async () => {
    try {
      const res = await window.asoIMS.refreshToken();
      if (res?.tokenInfo) {
        authErrorMessage.value = '';
        await getASOToken();
        asoSessionTrigger.value += 1;
        clearInterval(sessionIntervalId);
      }
    } catch (e) {
      // no-op
    }
  }, ASO_POLL_INTERVAL_MS);

  setTimeout(() => {
    clearInterval(sessionIntervalId);
  }, ASO_TIMEOUT_MS);
}

export default function SEO() {
  useEffect(() => {
    getResults();
    if (!isAso) return;

    if (!asoCache.sessionToken) {
      authErrorMessage.value = 'Please make sure you are authenticated with IMS';
      return;
    }

    const intervalIdIdentify = setInterval(() => {
      if (asoCache.identify?.length > 0) {
        asoCache.identify.forEach((partial) => {
          const targetSignal = signals.find((s) => s.value.id === partial.id);
          if (targetSignal) toUIFormat(partial, targetSignal);
        });
      }
      if (asoCache.identifyFinished) clearInterval(intervalIdIdentify);
    }, 1000);

    const intervalIdSuggest = setInterval(() => {
      if (asoCache.suggest?.length > 0) aiSuggestions.value = asoCache.suggest;
      if (asoCache.suggestFinished) clearInterval(intervalIdSuggest);
    }, 1000);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalIdIdentify);
      clearInterval(intervalIdSuggest);
    }, ASO_TIMEOUT_MS);

    // eslint-disable-next-line
    return () => {
      clearInterval(intervalIdIdentify);
      clearInterval(intervalIdSuggest);
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line
  }, [asoSessionTrigger.value]);

  return authErrorMessage.value ? html`
  <div class="preflight-auth-error"><p class="warning">${authErrorMessage.value}</p>
    <button class="preflight-action" onclick=${handleAsoSignIn}>
      Sign in
    </button>
  </div>` : html`
    <div class=preflight-columns>
      <div class=preflight-column>
        <${SeoItem} id=${SEO_IDS.title} supportsAi icon=${titleResult.value.icon} title=${titleResult.value.title} description=${titleResult.value.description} />
        <${SeoItem} id=${SEO_IDS.h1Count} icon=${h1Result.value.icon} title=${h1Result.value.title} description=${h1Result.value.description} />
        <${SeoItem} id=${SEO_IDS.canonical} icon=${canonResult.value.icon} title=${canonResult.value.title} description=${canonResult.value.description} />
        <${SeoItem} id=${SEO_IDS.links} icon=${linksResult.value.icon} title=${linksResult.value.title} description=${linksResult.value.description} />
      </div>
      <div class=preflight-column>
        <${SeoItem} id=${SEO_IDS.bodySize} icon=${bodyResult.value.icon} title=${bodyResult.value.title} description=${bodyResult.value.description} />
        <${SeoItem} id=${SEO_IDS.loremIpsum} supportsAi icon=${loremResult.value.icon} title=${loremResult.value.title} description=${loremResult.value.description} />
        <${SeoItem} id=${SEO_IDS.description} supportsAi icon=${descResult.value.icon} title=${descResult.value.title} description=${descResult.value.description} />
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

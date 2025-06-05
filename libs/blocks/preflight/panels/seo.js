import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { preflightCache } from '../checks/asoApi.js';

const DEF_ICON = 'purple';
const DEF_DESC = 'Checking...';
const pass = 'green';
const fail = 'red';

const defaultResults = {
  title: { icon: DEF_ICON, title: 'Title size', description: DEF_DESC, aiSuggestion: null, supportsAi: true },
  h1: { icon: DEF_ICON, title: 'H1 count', description: DEF_DESC, aiSuggestion: null, supportsAi: false },
  canon: { icon: DEF_ICON, title: 'Canonical', description: DEF_DESC, aiSuggestion: null, supportsAi: false },
  desc: { icon: DEF_ICON, title: 'Meta description', description: DEF_DESC, aiSuggestion: null, supportsAi: true },
  body: { icon: DEF_ICON, title: 'Body size', description: DEF_DESC, aiSuggestion: null, supportsAi: false },
  lorem: { icon: DEF_ICON, title: 'Lorem Ipsum', description: DEF_DESC, aiSuggestion: null, supportsAi: true },
  links: { icon: DEF_ICON, title: 'Links', description: DEF_DESC, aiSuggestion: null, supportsAi: false },
};

const seoResults = signal({ ...defaultResults });
const aiLoading = signal({});
const badLinks = signal([]);
const aiSuggestionVisibleState = signal({});
const suggestChecksCache = signal(null);

function findOpportunity(data, where, what) {
  const desiredItem = data.find((item) => item.name === where);
  if (!desiredItem) return null;
  return desiredItem.opportunities.find(({ tagName, check }) => [tagName, check].includes(what));
}

function updateResult(key, updates) {
  seoResults.value = {
    ...seoResults.value,
    [key]: { ...seoResults.value[key], ...updates },
  };
}

function checkH1s(audits) {
  const opportunity = findOpportunity(audits, 'h1-count', 'multiple-h1')
    || findOpportunity(audits, 'h1-count', 'missing-h1');
  if (opportunity?.issue) {
    updateResult('h1', { icon: fail, description: opportunity.issue });
    return fail;
  }
  updateResult('h1', { icon: pass, description: 'Only one H1 on the page.' });
  return pass;
}

function checkTitle(audits) {
  const opportunity = findOpportunity(audits, 'metatags', 'title');
  if (opportunity?.issue) {
    updateResult('title', {
      icon: fail,
      description: `${opportunity.issue}; ${opportunity.issueDetails}`,
      aiSuggestion: opportunity.aiSuggestion || null,
    });
    return fail;
  }
  updateResult('title', { icon: pass, description: 'Title size is good.', aiSuggestion: null });
  return pass;
}

function checkCanon(audits) {
  const opportunity = findOpportunity(audits, 'canonical', 'canonical-url-4xx')
    || findOpportunity(audits, 'canonical', 'canonical-redirect');
  if (opportunity?.issue) {
    updateResult('canon', {
      icon: fail,
      description: opportunity.issue,
      aiSuggestion: opportunity.aiSuggestion || null,
    });
    return fail;
  }
  updateResult('canon', { icon: pass, description: 'Canonical is valid.', aiSuggestion: null });
  return pass;
}

function checkDescription(audits) {
  const opportunity = findOpportunity(audits, 'metatags', 'description');
  if (opportunity?.issue) {
    updateResult('desc', {
      icon: fail,
      description: `${opportunity.issue}; ${opportunity.issueDetails}`,
      aiSuggestion: opportunity.aiSuggestion || null,
    });
    return fail;
  }
  updateResult('desc', { icon: pass, description: 'Meta description is good.', aiSuggestion: null });
  return pass;
}

function checkBody(audits) {
  const opportunity = findOpportunity(audits, 'body-size', 'content-length');
  if (opportunity?.issue) {
    updateResult('body', { icon: fail, description: opportunity.issue });
    return fail;
  }
  updateResult('body', { icon: pass, description: 'Body content has a good length.' });
  return pass;
}

function checkLorem(audits) {
  const opportunity = findOpportunity(audits, 'lorem-ipsum', 'placeholder-text');
  if (opportunity?.issue) {
    updateResult('lorem', { icon: fail, description: opportunity.issue, aiSuggestion: opportunity?.seoRecommendation });
    return fail;
  }
  updateResult('lorem', { icon: pass, description: 'No Lorem ipsum is used on the page.' });
  return pass;
}

function checkLinks(audits) {
  const badLinksMaybe = findOpportunity(audits, 'links', 'bad-links');
  const brokenLinksMaybe = findOpportunity(audits, 'links', 'broken-internal-links');
  const opportunities = [badLinksMaybe, brokenLinksMaybe].filter(Boolean);
  const issues = opportunities.flatMap(({ issue }) => issue);
  let aiSuggestion = null;
  if (brokenLinksMaybe && brokenLinksMaybe.aiSuggestion) {
    aiSuggestion = brokenLinksMaybe.aiSuggestion;
  }
  if (issues.length > 0) {
    updateResult('links', {
      icon: fail,
      description: issues[0].issue,
      aiSuggestion: aiSuggestion || null,
    });
    badLinks.value = issues.map((issue) => ({
      liveHref: issue.url,
      status: issue.issue,
      parent: 'main',
    }));
    return fail;
  }
  updateResult('links', { icon: pass, description: 'Links are valid.', aiSuggestion: null });
  badLinks.value = [];
  return pass;
}

function updateAllAiSuggestionsFromAudits(audits) {
  const titleOpp = findOpportunity(audits, 'metatags', 'title');
  if (titleOpp && titleOpp.aiSuggestion) updateResult('title', { aiSuggestion: titleOpp.aiSuggestion });

  const descOpp = findOpportunity(audits, 'metatags', 'description');
  if (descOpp && descOpp.aiSuggestion) updateResult('desc', { aiSuggestion: descOpp.aiSuggestion });
}

export async function sendResults() {
  const robots = document.querySelector('meta[name="robots"]')?.content || 'all';
  const data = {
    dateTime: new Date().toLocaleString(),
    url: window.location.href,
    H1: seoResults.value.h1.description,
    httpsLinks: seoResults.value.links.description,
    title: seoResults.value.title.description,
    canon: seoResults.value.canon.description,
    metaDescription: seoResults.value.desc.description,
    loremIpsum: seoResults.value.lorem.description,
    bodyLength: seoResults.value.body.description,
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

async function getResults(checks) {
  if (!checks) return;
  const [checkData] = checks;
  const { audits } = checkData;
  checkH1s(audits);
  checkTitle(audits);
  checkCanon(audits);
  checkDescription(audits);
  checkBody(audits);
  checkLorem(audits);
  checkLinks(audits);

  const icons = [
    seoResults.value.h1.icon,
    seoResults.value.title.icon,
    seoResults.value.canon.icon,
    seoResults.value.desc.icon,
    seoResults.value.body.icon,
    seoResults.value.lorem.icon,
    seoResults.value.links.icon,
  ];
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

function SeoItem({ data, loading, aiSuggestionVisible }) {
  const { icon, title, description, aiSuggestion, supportsAi } = data;
  return html`
    <div class=preflight-item>
      <div class="result-icon ${icon}"></div>
      <div class=preflight-item-text>
        <p class=preflight-item-title>${title}</p>
        <p class=preflight-item-description>${description}</p>
        ${supportsAi && loading && icon !== 'green' && html`<p class="ai-suggestion">AI suggestion: <div class="result-icon purple"></div></p>`}
        ${aiSuggestionVisible && aiSuggestion && html`<p class="ai-suggestion">AI suggestion: ${aiSuggestion}</p>`}
      </div>
    </div>`;
}

async function waitForPromise(obj, key, timeout = 5000) {
  const start = Date.now();
  while (!obj[key]) {
    if (Date.now() - start > timeout) throw new Error('Timeout waiting for preflight promise');
    // eslint-disable-next-line
    await new Promise((r) => setTimeout(r, 50));
  }
  return obj[key];
}

export default function Panel() {
  useEffect(() => {
    const runChecks = async () => {
      const checks = await waitForPromise(preflightCache, 'identifyPromise').then((p) => p);
      getResults(checks);
      // Set loading for AI suggestions for all supportsAi keys
      const aiKeys = Object.keys(seoResults.value).filter((k) => seoResults.value[k].supportsAi);
      aiLoading.value = aiKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {});

      const suggestChecks = await preflightCache.suggestPromise;
      suggestChecksCache.value = suggestChecks;
      const [checkData] = suggestChecks;
      const { audits } = checkData;
      updateAllAiSuggestionsFromAudits(audits);
      // Show AI suggestions for all supportsAi keys
      aiSuggestionVisibleState.value = aiKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {});
      // Remove loading
      aiLoading.value = aiKeys.reduce((acc, k) => ({ ...acc, [k]: false }), {});
    };
    runChecks();
  }, []);

  return html`
    <div class=preflight-columns>
      <div class=preflight-column>
        ${['title', 'h1', 'canon', 'links'].map((key) => html`<${SeoItem}
            data=${seoResults.value[key]}
            loading=${!!aiLoading.value[key]}
            aiSuggestionVisible=${!!aiSuggestionVisibleState.value[key]}
          />`)}
      </div>
      <div class=preflight-column>
        ${['body', 'lorem', 'desc'].map((key) => html`<${SeoItem}
            data=${seoResults.value[key]}
            loading=${!!aiLoading.value[key]}
            aiSuggestionVisible=${!!aiSuggestionVisibleState.value[key]}
          />`)}
      </div>
    </div>
    <div class='problem-links'>
      ${badLinks.value.length > 0 && html`
        <p class="note">Close preflight to see problem links highlighted on page.</p>
        <table>
          <tr>
            <th></th>
            <th>Problematic URLs</th>
            <th>Located in</th>
            <th>Status</th>
          </tr>
          ${badLinks.value.map((link, idx) => html`
            <tr>
              <td>${idx + 1}.</td>
              <td><a href='${link?.liveHref}' target='_blank'>${link?.liveHref}</a></td>
              <td><span>${link?.parent}</span></td>
              <td><span>${link?.status}</span></td>
            </tr>`)}
        </table>`}
    </div>`;
}

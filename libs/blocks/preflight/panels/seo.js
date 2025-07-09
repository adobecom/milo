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

function findOpportunity(data, where, what) {
  const desiredItem = data?.find((item) => item.name === where);
  if (!desiredItem) return null;
  return desiredItem.opportunities.find(({ tagName, check }) => [tagName, check].includes(what));
}

function updateResult(key, updates) {
  seoResults.value = {
    ...seoResults.value,
    [key]: { ...seoResults.value[key], ...updates },
  };
}

function checkH1s(data) {
  const opportunity = findOpportunity(data.audits, 'h1-count', 'multiple-h1')
    || findOpportunity(data.audits, 'h1-count', 'missing-h1');
  if (opportunity?.issue) {
    updateResult('h1', { icon: fail, description: opportunity.issue });
    return fail;
  }
  if (data.status === 'COMPLETED' && !opportunity?.issue) updateResult('h1', { icon: pass, description: 'Only one H1 on the page.' });
  return pass;
}

function checkTitle(data) {
  const opportunity = findOpportunity(data.audits, 'metatags', 'title');
  if (opportunity?.issue) {
    updateResult('title', {
      icon: fail,
      description: `${opportunity.issue}; ${opportunity.issueDetails}`,
      aiSuggestion: opportunity.aiSuggestion || null,
    });
    return fail;
  }
  if (data.status === 'COMPLETED' && !opportunity?.issue) {
    updateResult('title', { icon: pass, description: 'Title size is good.', aiSuggestion: null });
  }
  return pass;
}

function checkCanon(data) {
  const opportunity = findOpportunity(data.audits, 'canonical', 'canonical-url-4xx')
    || findOpportunity(data.audits, 'canonical', 'canonical-redirect');
  if (opportunity?.issue) {
    updateResult('canon', {
      icon: fail,
      description: opportunity.issue,
      aiSuggestion: opportunity.aiSuggestion || null,
    });
    return fail;
  }
  if (data.status === 'COMPLETED' && !opportunity?.issue) updateResult('canon', { icon: pass, description: 'Canonical is valid.', aiSuggestion: null });
  return pass;
}

function checkDescription(data) {
  const opportunity = findOpportunity(data.audits, 'metatags', 'description');
  if (opportunity?.issue) {
    updateResult('desc', {
      icon: fail,
      description: `${opportunity.issue}; ${opportunity.issueDetails}`,
      aiSuggestion: opportunity.aiSuggestion || null,
    });
    return fail;
  }
  if (data.status === 'COMPLETED' && !opportunity?.issue) updateResult('desc', { icon: pass, description: 'Meta description is good.', aiSuggestion: null });
  return pass;
}

function checkBody(data) {
  const opportunity = findOpportunity(data.audits, 'body-size', 'content-length');
  if (opportunity?.issue) {
    updateResult('body', { icon: fail, description: opportunity.issue });
    return fail;
  }
  if (data.status === 'COMPLETED' && !opportunity?.issue) updateResult('body', { icon: pass, description: 'Body content has a good length.' });
  return pass;
}

function checkLorem(data) {
  const opportunity = findOpportunity(data.audits, 'lorem-ipsum', 'placeholder-text');
  if (opportunity?.issue) {
    updateResult('lorem', { icon: fail, description: opportunity.issue, aiSuggestion: opportunity?.seoRecommendation });
    return fail;
  }
  if (data.status === 'COMPLETED' && !opportunity?.issue) updateResult('lorem', { icon: pass, description: 'No Lorem ipsum is used on the page.' });
  return pass;
}

function checkLinks(data) {
  const badLinksMaybe = findOpportunity(data.audits, 'links', 'bad-links');
  const brokenLinksMaybe = findOpportunity(data.audits, 'links', 'broken-internal-links');
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
  if (data.status === 'COMPLETED' && issues.length < 1) updateResult('links', { icon: pass, description: 'Links are valid.', aiSuggestion: null });
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

async function getResults(data) {
  if (!data.audits) return;
  checkH1s(data);
  checkTitle(data);
  checkCanon(data);
  checkDescription(data);
  checkBody(data);
  checkLorem(data);
  checkLinks(data);

  if (data.status !== 'COMPLETED') return;
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

function SeoItem({ data, loading }) {
  const { icon, title, description, aiSuggestion, supportsAi } = data;
  const showLoadingAi = supportsAi && loading && icon === 'red' && !aiSuggestion;

  return html`
    <div class=preflight-item>
      <div class="result-icon ${icon}"></div>
      <div class=preflight-item-text>
        <p class=preflight-item-title>${title}</p>
        <p class=preflight-item-description>${description}</p>
        ${showLoadingAi && html`<p class="ai-suggestion">AI suggestion: <div class="result-icon purple"></div></p>`}
        ${aiSuggestion && html`<p class="ai-suggestion">AI suggestion: ${aiSuggestion}</p>`}
      </div>
    </div>`;
}

export default function Panel() {
  useEffect(() => {
    let intervalIdIdentify;
    let intervalIdSuggest;

    function checkAndRunIdentify() {
      if (preflightCache.identify) {
        getResults(preflightCache.identify);
        if (preflightCache.identify.status === 'COMPLETED') clearInterval(intervalIdIdentify);
      }
    }

    function checkAndRunSuggest() {
      if (preflightCache.suggest) {
        getResults(preflightCache.suggest);
        updateAllAiSuggestionsFromAudits(preflightCache.suggest.audits);
        const aiKeys = Object.keys(seoResults.value).filter((k) => seoResults.value[k].supportsAi);
        aiLoading.value = aiKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {});
        if (preflightCache.suggest.status === 'COMPLETED') {
          aiLoading.value = aiKeys.reduce((acc, k) => ({ ...acc, [k]: false }), {});
          clearInterval(intervalIdSuggest);
        }
      }
    }

    intervalIdIdentify = setInterval(checkAndRunIdentify, 1000);
    intervalIdSuggest = setInterval(checkAndRunSuggest, 1000);

    return () => {
      clearInterval(intervalIdIdentify);
      clearInterval(intervalIdSuggest);
    };
  }, []);

  return html`
    <div class=preflight-columns>
      <div class=preflight-column>
        ${['title', 'h1', 'canon', 'links'].map((key) => (html`<${SeoItem}
                data=${seoResults.value[key]}
                loading=${!!aiLoading.value[key]}
              />`))}
      </div>
      <div class=preflight-column>
        ${['body', 'lorem', 'desc'].map((key) => (html`<${SeoItem}
                data=${seoResults.value[key]}
                loading=${!!aiLoading.value[key]}
              />`))}
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

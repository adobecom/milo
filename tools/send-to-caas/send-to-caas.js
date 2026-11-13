/* eslint-disable new-cap */
/* global tingle */
/* eslint-disable no-alert */
import { getImsToken } from '../utils/utils.js';
import {
  EXTENSIONLESS_SECTIONS_META,
  findUnrecognizedSections,
  isFlagUnrecognized,
  isHtmlIdentityEnabled,
  isIdentityPolicyMiss,
  normalizeSections,
} from '../../libs/utils/caasIdentity.js';

import {
  getCardMetadata,
  getCaasProps,
  isPagePublished,
  loadCaasTags,
  postDataToCaaS,
  setConfig,
  getConfig,
} from './send-utils.js';

const [setPublishingTrue, setPublishingFalse, isPublishing] = (() => {
  let publishing = false;
  return [
    () => { publishing = true; },
    () => { publishing = false; },
    () => publishing,
  ];
})();

// Tingle is the js library for displaying modals
const loadTingleModalFiles = async (loadScript, loadStyle) => {
  if (!window.tingle?.modal) {
    await Promise.all([
      loadScript('https://milo.adobe.com/libs/deps/tingle.js'),
      loadStyle('https://milo.adobe.com/libs/deps/tingle.css'),
    ]);
  }
};

const showAlert = (msg, { error = false, onClose, showBtn = true, btnText = 'OK' } = {}) => {
  const modal = new tingle.modal({
    footer: true,
    closeMethods: ['overlay', 'escape'],
    onClose() {
      if (onClose) { onClose(); }
      this.destroy();
    },
  });
  let msgContent = msg;
  if (error) { // show alert icon
    msgContent = `<div class="modal-error"><div class="modal-alert"></div><div>${msg}</div></div>`;
  }
  modal.setContent(msgContent);
  if (showBtn) {
    modal.addFooterBtn(btnText, 'tingle-btn tingle-btn--primary tingle-btn--pull-right', () => modal.close());
  }
  modal.open();
  return modal;
};

const showConfirm = (msg, {
  onClose,
  cssClass = [],
  ctaBtnType = 'primary',
  ctaText = 'OK',
  cancelBtnType = 'default',
  cancelText = 'Cancel',
  footerContent = '',
  initCode,
  leftButton,
} = {}) => new Promise((resolve) => {
  let ok = false;
  const modal = new tingle.modal({
    cssClass,
    footer: true,
    closeMethods: ['escape'],
    onClose() {
      if (onClose) onClose(this);
      this.destroy();
      resolve(ok);
    },
  });
  modal.setContent(msg);
  if (footerContent) {
    modal.setFooterContent(footerContent);
  }

  if (ctaText) {
    modal.addFooterBtn(ctaText, `tingle-btn tingle-btn--${ctaBtnType} tingle-btn--pull-right`, () => {
      ok = true;
      modal.close();
    });
  }

  modal.addFooterBtn(cancelText, `tingle-btn tingle-btn--${cancelBtnType} tingle-btn--pull-right`, () => {
    ok = false;
    modal.close();
  });
  if (leftButton) {
    modal.addFooterBtn(leftButton.text, 'tingle-btn tingle-btn--default tingle-btn--pull-left', () => {
      leftButton.callback?.();
    });
  }

  if (initCode) initCode(modal.modal);

  modal.open();
});

const displayPublishingModal = () => {
  const publishingModal = new tingle.modal({
    closeMethods: [],
    cssClass: ['modal-text-align-center'],
    onClose() {
      this.destroy();
    },
  });
  publishingModal.setContent('Publishing to CaaS...');
  publishingModal.open();
  return publishingModal;
};

const verifyInfoModal = async (tags, tagErrors, showAllPropertiesAlert) => {
  let okToContinue = false;
  let draftOnly = false;
  let useHtml = false;
  let caasEnv;

  const seeAllPropsBtn = {
    text: 'See all properties',
    callback: showAllPropertiesAlert,
  };

  const footerOptions = `
    <div class="verify-info-footer">
      <div class="caas-env">
        <label for="caas-env-select">CaaS Env</label>
        <select name="1A" id="caas-env-select">
          <option>Prod</option>
          <option>Stage</option>
          <option>Dev</option>
        </select>
      </div>
      <div id="caas-draft-cb">
        <input type="checkbox" id="draftcb" name="draftcb">
        <label for="draftcb">Publish to Draft only</label>
      </div>
      <div id="caas-use-html-cb" class="field checkbox">
        <input type="checkbox" id="usehtml" name="usehtml">
        <label for="usehtml">Use .html extension</label>
      </div>
    </div>`;

  const onClose = () => {
    caasEnv = document.getElementById('caas-env-select')?.value?.toLowerCase();
    draftOnly = document.getElementById('draftcb')?.checked;
    useHtml = document.getElementById('usehtml')?.checked;
  };

  const modalInit = (modal) => {
    const caasEnvSelect = modal.querySelector('#caas-env-select');
    const caasEnvVal = caasEnvSelect.value?.toLowerCase();
    const useHtmlCb = modal.querySelector('#usehtml');
    if (caasEnvVal === 'prod') {
      useHtmlCb.checked = true;
    }
    caasEnvSelect.addEventListener('change', (e) => {
      useHtmlCb.checked = e.target.value?.toLowerCase() === 'prod';
    });
  };

  if (!tags.length) {
    const msg = '<div><p><b>No Tags found on page</b></p><p>Please add at least one tag to the Card Metadata</p></div>';
    okToContinue = await showConfirm(msg, {
      cssClass: ['verify-info-modal'],
      ctaText: '',
      cancelBtnType: 'danger',
      cancelText: 'Cancel Registration',
      footerContent: footerOptions,
      leftButton: seeAllPropsBtn,
      onClose,
    });
  } else if (tagErrors.length) {
    const msg = [
      '<div class="">',
      '<p><b>The following tags were not found:</b></p>',
      tagErrors.join('<br>'),
      '<p><b>Ok to publish without those tags defined?</b></p>',
      '<p>The following tags will be used:</p>',
      tags.join('<br>'),
      '</div>',
    ].join('');
    okToContinue = await showConfirm(msg, {
      cssClass: ['verify-info-modal'],
      ctaText: 'Publish with missing tags',
      cancelBtnType: 'grey',
      cancelText: 'Cancel Registration',
      ctaBtnType: 'danger',
      footerContent: footerOptions,
      initCode: modalInit,
      leftButton: seeAllPropsBtn,
      onClose,
    });
  } else {
    const msg = [
      '<div><p><b>The following tags will be used:</b></p>',
      tags.join('<br>'),
      '<p><b>Please verify that these are correct.</b></p></div>',
    ].join('');
    okToContinue = await showConfirm(msg, {
      cssClass: ['verify-info-modal'],
      cancelBtnType: 'grey',
      cancelText: 'Cancel Registration',
      ctaText: 'Continue with these tags',
      footerContent: footerOptions,
      initCode: modalInit,
      leftButton: seeAllPropsBtn,
      onClose,
    });
  }
  return {
    caasEnv,
    draftOnly,
    okToContinue,
    useHtml,
  };
};

const isUseHtmlChecked = () => document.getElementById('usehtml')?.checked;

const sortObjByPropName = (obj) => Object.keys(obj)
  // eslint-disable-next-line no-return-assign, no-sequences
  .sort().reduce((c, d) => (c[d] = obj[d], c), {});

const validateProps = async (prodHost, publishingModal) => {
  // The sidekick publishes the page it is running on, so the page's own opt-in
  // metadata is the flag source. Without this the single-page tool would mint a
  // legacy id for a page the bulk/auto publishers give a forced-`.html` id,
  // creating a duplicate card for one page.
  //
  // KNOWN DIVERGENCE (needs a follow-up ticket -- see PR #7106 description):
  // this reads page metadata, while
  // auto-publish resolves the same flag from the path-scoped rules in
  // `/.milo/caas/config.json`. The two agree only while a site keeps them in
  // sync by hand, and a disagreement is silent -- the page publishes fine, just
  // under a second contentId, so the duplicate surfaces later as a stray card
  // rather than as an error here. Reconciling them properly means teaching this
  // tool the auto-publish rule-matching engine (path globs, per-env overrides),
  // which is a larger change than this ticket should carry. Operational rule
  // until then: a site enabling the policy must set BOTH the
  // `caas-identity-html` metadata and the `htmlIdentity` config.json column --
  // and, where it publishes a section extensionless, both the
  // `caas-identity-extensionless-sections` metadata and the matching
  // `htmlIdentitySections` column.
  //
  // CONSUMER PREREQUISITE: that last clause is the steady state, not today's.
  // Collection card resolution does not yet read
  // `caas-identity-extensionless-sections` -- it ships with MWPW-213847. Until
  // then, and while the policy is on, authoring the metadata for a section is
  // worse than omitting it: the publishers preserve that section's
  // extensionless ids while URL-based card lookups keep hashing the `.html`
  // form, so every card in the section drops out of the collections
  // referencing it, localized paths included. Leave the sections metadata
  // unset until consumer resolution is deployed.
  const identityMeta = document.head.querySelector('meta[name="caas-identity-html"]')?.content;
  if (isFlagUnrecognized(identityMeta)) {
    // Resolves to OFF, so this page would publish under a legacy id while the
    // bulk/auto publishers give it a forced-`.html` one -- a duplicate card
    // rather than an error. Surfaced for parity with the other publishers.
    window.lana?.log(
      `send-to-caas: unrecognized caas-identity-html metadata '${identityMeta}', treating as OFF`,
      { tags: 'caas,htmlIdentity', severity: 'warning', sampleRate: 100 },
    );
  }
  const htmlIdentity = isHtmlIdentityEnabled(identityMeta);
  // The qualifier travels with the flag, from the companion metadata. This is
  // a publishing channel like any other, so omitting it here would force
  // `.html` onto the very sections the site publishes extensionless -- while
  // auto-publish, reading htmlIdentitySections from config.json, would not.
  // One page, two contentIds, no error. It also sets the polarity of the
  // isIdentityPolicyMiss check below, which inverts inside an exempt section.
  const sectionsMeta = document.head.querySelector(`meta[name="${EXTENSIONLESS_SECTIONS_META}"]`)?.content ?? '';
  const badSections = findUnrecognizedSections(sectionsMeta);
  if (badSections.length) {
    window.lana?.log(
      `send-to-caas: unrecognized ${EXTENSIONLESS_SECTIONS_META} entries `
      + `'${badSections.join(', ')}'. These name a path, host or glob rather than a bare `
      + 'path segment, so they match nothing and the section keeps forced-`.html` ids.',
      { tags: 'caas,htmlIdentity', severity: 'warning', sampleRate: 100 },
    );
  }
  const htmlIdentitySections = normalizeSections(sectionsMeta).join(',');
  const { caasMetadata, errors, tags, tagErrors } = await getCardMetadata(
    { prodUrl: `${prodHost}${window.location.pathname}`, htmlIdentity, htmlIdentitySections },
  );

  const showAllPropertiesAlert = async () => {
    const { caasMetadata: cMetaData } = await getCardMetadata(
      {
        prodUrl: `${prodHost}${window.location.pathname}${isUseHtmlChecked() ? '.html' : ''}`,
        htmlIdentity,
        htmlIdentitySections,
      },
    );
    const mdStr = JSON.stringify(sortObjByPropName(cMetaData), undefined, 4);
    showAlert(`<h3>All CaaS Properties</h3><pre id="json" style="white-space:pre-wrap;font-size:14px;">${mdStr}</pre>`);
  };

  const { draftOnly, caasEnv, okToContinue, useHtml } = await verifyInfoModal(
    tags,
    tagErrors,
    showAllPropertiesAlert,
  );

  if (!okToContinue) {
    setPublishingFalse();
    publishingModal.close();
    return false;
  }

  if (errors.length) {
    publishingModal.close();
    const msg = [
      '<p>There were problems with the following:</p>',
      errors.join('<br>'),
      '<p>Publishing to CaaS aborted, please fix errors and try again.</p>',
    ].join('');
    showAlert(msg, { error: true, onClose: setPublishingFalse });
    return false;
  }

  let metaWithUseHtml;
  if (useHtml) {
    ({ caasMetadata: metaWithUseHtml } = await getCardMetadata(
      { prodUrl: `${prodHost}${window.location.pathname}.html`, htmlIdentity, htmlIdentitySections },
    ));
  }

  // The unrecognized-value check above catches a typo, which is the rare case.
  // This catches the common one: metadata simply absent while the site's
  // config.json rule has htmlIdentity on. That publishes the page under a
  // second contentId with no error at all, surfacing weeks later as a stray
  // duplicate card. The sidekick runs on a real Milo page, so lana is loaded
  // here (as it also is for bulk-publish-v2, though not for the standalone
  // bulk publisher page, da-live or the poller).
  //
  // Evaluated on the url actually being published, AFTER the modal resolves and
  // after the abort paths above. Checking `pathname` alone before `useHtml` was
  // known reported a duplicate for the operator who DID tick "use .html": for
  // an ordinary section that publish ends in `.html` and mints exactly the
  // legacy id, so there is no duplicate. On a post-migration BACOM page with
  // the metadata absent that false positive would have fired on every correct
  // sidekick publish. In an extensionless section the `.html` form is instead
  // the one that misses, which isIdentityPolicyMiss now reports correctly.
  const publishedProdUrl = `${prodHost}${window.location.pathname}${useHtml ? '.html' : ''}`;
  if (isIdentityPolicyMiss(publishedProdUrl, htmlIdentity, htmlIdentitySections)) {
    window.lana?.log(
      'send-to-caas: publishing an in-scope url without caas-identity-html. If this '
      + "site's config.json sets htmlIdentity, this mints a DUPLICATE card under a "
      + `second contentId. Page: ${publishedProdUrl}`,
      { tags: 'caas,htmlIdentity', severity: 'warning', sampleRate: 100 },
    );
  }

  return {
    caasEnv,
    caasMetadata: metaWithUseHtml || caasMetadata,
    draftOnly,
  };
};

const checkPublishStatus = async (publishingModal) => {
  if (!(await isPagePublished())) {
    publishingModal.close();
    showAlert(
      'Page must be published before it can be registered with CaaS.<br>Please publish the page and try again.',
      { error: true },
    );
    setPublishingFalse();
    return false;
  }
  return true;
};

const checkIms = async (publishingModal, loadScript) => {
  const accessToken = await getImsToken(loadScript);
  if (!accessToken) {
    publishingModal.close();
    const shouldLogIn = await showConfirm(
      'You must be logged in with an Adobe ID in order to publish to CaaS.\nDo you want to log in?',
    );
    if (shouldLogIn) {
      const { signInContext } = getConfig();
      window.adobeIMS.signIn(signInContext);
    }
    setPublishingFalse();
    return false;
  }
  return accessToken;
};

const postToCaaS = async ({ accessToken, caasEnv, caasProps, draftOnly, publishingModal }) => {
  try {
    const response = await postDataToCaaS({ accessToken, caasEnv, caasProps, draftOnly });

    publishingModal.close();

    if (response.success) {
      showAlert(
        `<p>Successfully published page to CaaS!<p><p>Card ID: ${caasProps.entityId}</p>`,
        { onClose: setPublishingFalse },
      );
    } else if (response.error?.startsWith('Invalid User: Not an Adobe employee')) {
      const msg = 'Please login with your Adobe company account.  Do you want to try logging in again?';
      const shouldLogIn = await showConfirm(msg, {
        cancelBtnType: 'grey',
        cancelText: 'Cancel',
        ctaText: 'Login',
      });
      setPublishingFalse();
      if (shouldLogIn) {
        const { signInContext } = getConfig();
        window.adobeIMS.signIn(signInContext);
      }
    } else {
      showAlert(
        response.message || response.error || JSON.stringify(response),
        { error: true, onClose: setPublishingFalse },
      );
    }
  } catch (e) {
    publishingModal.close();
    setPublishingFalse();
    showAlert(`Error posting to CaaS:<br>${e.message}`, { error: true });
  }
};

const noop = () => {};

const sendToCaaS = async ({ host = '', project = '', branch = '', repo = '', owner = '' } = {}, loadScript = noop, loadStyle = noop) => {
  if (isPublishing()) return;

  await loadTingleModalFiles(loadScript, loadStyle);
  if (window.adobeid?.environment !== 'prod') {
    showAlert(
      'Send to CaaS needs to reload the page with prod IMS setup.  Please try again after reload.',
      {
        onClose: () => {
          const url = new URL(window.location);
          url.searchParams.append('env', 'prod');
          window.location.assign(url);
        },
      },
    );
    return;
  }

  setConfig({
    host: host || window.location.host, project, branch, repo, owner, doc: document,
  });

  loadStyle('https://milo.adobe.com/tools/send-to-caas/send-to-caas.css');

  setPublishingTrue();
  const publishingModal = displayPublishingModal();

  try {
    if (!host) throw new Error('host must be specified');

    await loadCaasTags();
    const { caasEnv, caasMetadata, draftOnly } = await validateProps(host, publishingModal);
    if (!caasMetadata) return;

    const isPublished = await checkPublishStatus(publishingModal);
    if (!isPublished) return;

    const accessToken = await checkIms(publishingModal, loadScript);
    if (!accessToken) return;

    const caasProps = getCaasProps(caasMetadata);

    postToCaaS({ accessToken, caasEnv, caasProps, draftOnly, publishingModal });
  } catch (e) {
    setPublishingFalse();
    publishingModal.close();
    showAlert(`ERROR: ${e.message}`, { error: true });
  }
};

export {
  loadTingleModalFiles,
  sendToCaaS,
  showAlert,
  showConfirm,
};

/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/**
 * The decision engine for where to get Milo's libs from.
 */
export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs, location) => {
      libs = (() => {
        const { hostname, search } = location || window.location;
        if (!(hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local'))) return prodLibs;
        const branch = new URLSearchParams(search).get('milolibs') || 'main';
        if (branch === 'local') return 'http://localhost:6456/libs';
        return branch.includes('--') ? `https://${branch}.aem.live/libs` : `https://${branch}--milo--adobecom.aem.live/libs`;
      })();
      return libs;
    }, () => libs,
  ];
})();

/*
 * ------------------------------------------------------------
 * Edit above at your own risk.
 *
 * Note: This file should have no self-invoking functions.
 * ------------------------------------------------------------
 */
const cachedMetadata = [];
export const getMetadata = (name, doc = document) => {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
};
export function getCachedMetadata(name) {
  if (cachedMetadata[name] === undefined) cachedMetadata[name] = getMetadata(name);
  return cachedMetadata[name];
}

export function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
}

export async function getRedirectUri() {
  const { getConfig } = await import(`${getLibs()}/utils/utils.js`);
  if (getMetadata('adobe-home-redirect') === 'on') {
    const { env, locale } = getConfig();
    return `https://www${env.name !== 'prod' ? '.stage' : ''}.adobe.com${locale.prefix}`;
  }
  const BlockMediator = await import('./block-mediator.min.js');
  const branchLinkOriginPattern = /^https:\/\/adobesparkpost(-web)?\.app\.link/;
  function isBranchLink(url) {
    return url && branchLinkOriginPattern.test(new URL(url).origin);
  }
  const url = getMetadata('pep-destination')
      || BlockMediator.default.get('primaryCtaUrl')
      || document.querySelector('a.button.xlarge.same-fcta, a.primaryCTA')?.href;
  return isBranchLink(url) && url;
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });

export function createTag(tag, attributes, html, options = {}) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  options.parent?.append(el);
  return el;
}

export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

function sanitizeInput(input) {
  if (Number.isInteger(input)) return input;
  return input.replace(/[^a-zA-Z0-9-_]/g, ''); // Simple regex to strip out potentially dangerous characters
}

function createSVGWrapper(icon, sheetSize, alt, altSrc) {
  const svgWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgWrapper.classList.add('icon');
  svgWrapper.classList.add(`icon-${icon}`);
  svgWrapper.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/1999/xlink');
  if (alt) {
    svgWrapper.appendChild(createTag('title', { innerText: alt }));
  }
  const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  if (altSrc) {
    u.setAttribute('href', altSrc);
  } else {
    u.setAttribute('href', `/express/code/icons/ccx-sheet_${sanitizeInput(sheetSize)}.svg#${sanitizeInput(icon)}${sanitizeInput(sheetSize)}`);
  }
  svgWrapper.appendChild(u);
  return svgWrapper;
}

// eslint-disable-next-line default-param-last
export function getIconDeprecated(icons, alt, size = 44, altSrc) {
  // eslint-disable-next-line no-param-reassign
  icons = Array.isArray(icons) ? icons : [icons];
  const [defaultIcon, mobileIcon] = icons;
  const icon = mobileIcon && window.innerWidth < 600 ? mobileIcon : defaultIcon;
  const symbols = [
    'adobefonts',
    'adobe-stock',
    'android',
    'animation',
    'blank',
    'brand',
    'brand-libraries',
    'brandswitch',
    'calendar',
    'certified',
    'color-how-to-icon',
    'changespeed',
    'check',
    'chevron',
    'cloud-storage',
    'crop-image',
    'crop-video',
    'convert',
    'convert-png-jpg',
    'cursor-browser',
    'desktop',
    'desktop-round',
    'download',
    'elements',
    'facebook',
    'globe',
    'incredibly-easy',
    'instagram',
    'image',
    'ios',
    'libraries',
    'library',
    'linkedin',
    'magicwand',
    'mergevideo',
    'mobile-round',
    'muteaudio',
    'palette',
    'photos',
    'photoeffects',
    'pinterest',
    'play',
    'premium-templates',
    'pricingfree',
    'pricingpremium',
    'privacy',
    'qr-code',
    'remove-background',
    'resize',
    'resize-video',
    'reversevideo',
    'rush',
    'snapchat',
    'sparkpage',
    'sparkvideo',
    'stickers',
    'templates',
    'text',
    'tiktok',
    'trim-video',
    'twitter',
    'up-download',
    'upload',
    'users',
    'webmobile',
    'youtube',
    'star',
    'star-half',
    'star-empty',
    'pricing-gen-ai',
    'pricing-features',
    'pricing-import',
    'pricing-motion',
    'pricing-stock',
    'pricing-one-click',
    'pricing-collaborate',
    'pricing-premium-plan',
    'pricing-sync',
    'pricing-brand',
    'pricing-calendar',
    'pricing-fonts',
    'pricing-libraries',
    'pricing-cloud',
    'pricing-support',
    'pricing-sharing',
    'pricing-history',
    'pricing-corporate',
    'pricing-admin',
  ];

  const size22Icons = ['chevron', 'pricingfree', 'pricingpremium'];

  if (symbols.includes(icon) || altSrc) {
    let sheetSize = size;
    if (size22Icons.includes(icon)) sheetSize = 22;
    return createSVGWrapper(icon, sheetSize, alt, altSrc);
  }
  return createTag('img', {
    class: `icon icon-${icon}`,
    src: altSrc || `/express/code/icons/${icon}.svg`,
    alt: `${alt || icon}`,
  });
}

export function getIconElementDeprecated(icons, size, alt, additionalClassName, altSrc) {
  const icon = getIconDeprecated(icons, alt, size, altSrc);
  if (additionalClassName) icon.classList.add(additionalClassName);
  return icon;
}

export async function fixIcons(el = document) {
  /* backwards compatible icon handling, deprecated */
  el.querySelectorAll('svg use[href^="./_icons_"]').forEach(($use) => {
    $use.setAttribute('href', `/express/icons.svg#${$use.getAttribute('href').split('#')[1]}`);
  });

  let replaceKey;
  let getConfig;
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ getConfig } = utils);
    ({ replaceKey } = placeholders);
  });
  /* new icons handling */
  el.querySelectorAll('img').forEach(($img) => {
    const alt = $img.getAttribute('alt');
    if (alt) {
      const lowerAlt = alt.toLowerCase();
      if (lowerAlt.includes('icon:')) {
        const [icon, mobileIcon] = lowerAlt
          .split(';')
          .map((i) => {
            if (i) {
              return toClassName(i.split(':')[1].trim());
            }
            return null;
          });
        let altText = null;
        if (replaceKey(icon, getConfig())) {
          altText = replaceKey(icon, getConfig());
        } else if (replaceKey(mobileIcon, getConfig())) {
          altText = replaceKey(mobileIcon, getConfig());
        }
        const $picture = $img.closest('picture');
        const $block = $picture.closest('.section > div');
        let size = 44;
        if ($block) {
          const blockName = $block.classList[0];
          // use small icons in .columns (except for .columns.offer)
          if (blockName === 'columns') {
            size = $block.classList.contains('offer') ? 44 : 22;
          } else if (blockName === 'toc') {
            // ToC block has its own logic
            return;
          }
        }
        $picture.parentElement
          .replaceChild(getIconElementDeprecated([icon, mobileIcon], size, altText), $picture);
      }
    }
  });
}

// This was only added for the blocks premigration.
// For new blocks they should only use the decorateButtons method from milo.
export async function decorateButtonsDeprecated(el, size) {
  const { decorateButtons } = await import(`${getLibs()}/utils/decorate.js`);
  // eslint-disable-next-line max-len
  // DO NOT add any more exceptions here. Authors must learn to author buttons the new milo way, even with old blocks
  if (!el.closest('.ax-columns') && !el.closest('.banner') && !el.closest('.fullscreen-marquee') && !el.closest('.link-list')) decorateButtons(el, size);
  // DO NOT add any more exceptions above. We should be removing the exceptions and not adding more.
  el.querySelectorAll(':scope a:not(.con-button, .social-link)').forEach(($a) => {
    const originalHref = $a.href;
    const linkText = $a.textContent.trim();
    if ($a.children.length > 0) {
      // We can use this to eliminate styling so only text
      // propagates to buttons.
      $a.innerHTML = $a.innerHTML.replaceAll('<u>', '').replaceAll('</u>', '');
    }
    $a.title = $a.title || linkText;
    try {
      const { hash } = new URL($a.href);

      if (originalHref !== linkText
          && !(linkText.startsWith('https') && linkText.includes('/media_'))
          && !/hlx\.blob\.core\.windows\.net/.test(linkText)
          && !/aem\.blob\.core\.windows\.net/.test(linkText)
          && !linkText.endsWith(' >')
          && !(hash === '#embed-video')
          && !linkText.endsWith(' ›')
          && !linkText.endsWith('.svg')) {
        const $up = $a.parentElement;
        const $twoup = $a.parentElement.parentElement;
        if (!$a.querySelector('img')) {
          if ($up.childNodes.length === 1 && ($up.tagName === 'P' || $up.tagName === 'DIV')) {
            $a.classList.add('button', 'accent'); // default
            $up.classList.add('button-container');
          }
          if ($up.childNodes.length === 1 && $up.tagName === 'STRONG'
              && $twoup.children.length === 1 && $twoup.tagName === 'P') {
            $a.classList.add('button', 'accent');
            $twoup.classList.add('button-container');
          }
          if ($up.childNodes.length === 1 && $up.tagName === 'EM'
              && $twoup.children.length === 1 && $twoup.tagName === 'P') {
            $a.classList.add('button', 'accent', 'light');
            $twoup.classList.add('button-container');
          }
        }
        if (linkText.startsWith('{{icon-') && linkText.endsWith('}}')) {
          const $iconName = /{{icon-([\w-]+)}}/g.exec(linkText)[1];
          if ($iconName) {
            $a.appendChild(getIconDeprecated($iconName, `${$iconName} icon`));
            $a.classList.remove('button', 'primary', 'secondary', 'accent');
            $a.title = $iconName;
          }
        }
      }
    } catch (e) {
      window.lana?.log(`Ignoring button due to error: ${e}`);
    }
  });
}

export function addTempWrapperDeprecated($block, blockName) {
  const wrapper = document.createElement('div');
  const parent = $block.parentElement;
  wrapper.classList.add(`${blockName}-wrapper`);
  parent.insertBefore(wrapper, $block);
  wrapper.append($block);
}

export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children) {
      const $cols = [...$row.children];
      if ($cols[1]) {
        const $value = $cols[1];
        const name = toClassName($cols[0].textContent.trim());
        let value;
        if ($value.querySelector('a')) {
          const $as = [...$value.querySelectorAll('a')];
          if ($as.length === 1) {
            value = $as[0].href;
          } else {
            value = $as.map(($a) => $a.href);
          }
        } else if ($value.querySelector('p')) {
          const $ps = [...$value.querySelectorAll('p')];
          if ($ps.length === 1) {
            value = $ps[0].textContent.trim();
          } else {
            value = $ps.map(($p) => $p.textContent.trim());
          }
        } else value = $row.children[1].textContent.trim();
        config[name] = value;
      }
    }
  });
  return config;
}

export function hideQuickActionsOnDevices(userAgent) {
  if (getMetadata('fqa-off') || !!getMetadata('fqa-on')) return;
  document.body.dataset.device = userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  const fqaMeta = document.createElement('meta');
  fqaMeta.setAttribute('content', 'on');
  const isMobile = document.body.dataset.device === 'mobile';
  // safari won't work either mobile or desktop
  const isQualifiedBrowser = !/Safari/.test(userAgent) || /Chrome|CriOS|FxiOS|Edg|OPR|Opera|OPiOS|Vivaldi|YaBrowser|Avast|VivoBrowser|GSA/.test(userAgent);
  if (isMobile || !isQualifiedBrowser) {
    fqaMeta.setAttribute('name', 'fqa-off'); // legacy setup for mobile or desktop_safari
  } else {
    fqaMeta.setAttribute('name', 'fqa-on'); // legacy setup for desktop or non_safari
  }
  // up-to-date setup that supports mobile frictionless
  const audienceFqaMeta = document.createElement('meta');
  audienceFqaMeta.setAttribute('content', 'on');
  if (isQualifiedBrowser) {
    audienceFqaMeta.setAttribute('name', `fqa-qualified-${isMobile ? 'mobile' : 'desktop'}`);
  } else {
    audienceFqaMeta.setAttribute('name', 'fqa-non-qualified');
  }
  document.head.append(fqaMeta, audienceFqaMeta);
}

export function preDecorateSections(area) {
  if (!area) return;
  const selector = area === document ? 'body > main > div' : ':scope > div';
  area.querySelectorAll(selector).forEach((section) => {
    const sectionMetaBlock = section.querySelector('div.section-metadata');
    if (sectionMetaBlock) {
      const sectionMeta = readBlockConfig(sectionMetaBlock);

      // section meant for different device
      let sectionRemove = !!(sectionMeta.audience
        && sectionMeta.audience.toLowerCase() !== document.body.dataset?.device);

      // section visibility steered over metadata
      if (!sectionRemove && sectionMeta.showwith !== undefined) {
        let showWithSearchParam = null;
        if (!['www.adobe.com'].includes(window.location.hostname)) {
          const urlParams = new URLSearchParams(window.location.search);
          showWithSearchParam = urlParams.get(`${sectionMeta.showwith.toLowerCase()}`)
            || urlParams.get(`${sectionMeta.showwith}`);
        }
        const showwith = sectionMeta.showwith.toLowerCase();
        if (['fqa-off', 'fqa-on', 'fqa-non-qualified', 'fqa-qualified-mobile', 'fqa-qualified-desktop'].includes(showwith)) hideQuickActionsOnDevices(navigator.userAgent);
        sectionRemove = showWithSearchParam !== null ? showWithSearchParam !== 'on' : getMetadata(showwith) !== 'on';
      }
      if (sectionRemove) section.remove();
      else if (sectionMeta.anchor) section.id = sectionMeta.anchor;
      else if (sectionMeta.padding) section.setAttribute('data-padding', 'none');
    }
  });

  area.querySelectorAll(`${selector} > .billing-radio, ${selector} > .split-action`).forEach((el) => el.remove());

  // floating CTA vs page CTA with same text or link logics
  if (['yes', 'y', 'true', 'on'].includes(getMetadata('show-floating-cta')?.toLowerCase())) {
    const { device } = document.body.dataset;
    const textToTarget = getMetadata(`${device}-floating-cta-text`)?.trim() || getMetadata('main-cta-text')?.trim();
    const linkToTarget = getMetadata(`${device}-floating-cta-link`)?.trim() || getMetadata('main-cta-link')?.trim();
    if (textToTarget || linkToTarget) {
      let linkToTargetURL = null;
      try {
        linkToTargetURL = new URL(linkToTarget);
      } catch (err) {
        window.lana?.log(err);
      }
      const sameUrlCTAs = Array.from(area.querySelectorAll('a:any-link'))
        .filter((a) => {
          try {
            const currURL = new URL(a.href);
            const sameText = a.textContent.trim() === textToTarget;
            const samePathname = currURL.pathname === linkToTargetURL?.pathname;
            const sameHash = currURL.hash === linkToTargetURL?.hash;
            const isNotInFloatingCta = !a.closest('.block')?.classList.contains('floating-button');
            const notFloatingCtaIgnore = !a.classList.contains('floating-cta-ignore');

            return (sameText || (samePathname && sameHash))
              && isNotInFloatingCta && notFloatingCtaIgnore;
          } catch (err) {
            window.lana?.log(err);
            return false;
          }
        });

      sameUrlCTAs.forEach((cta) => {
        cta.classList.add('same-fcta');
      });
    }
  }
}

function renameConflictingBlocks(area, selector) {
  const replaceColumnBlock = (section) => {
    const columnBlock = section.querySelectorAll('div.columns');
    columnBlock.forEach((column) => {
      if (column.classList[0] !== 'columns') return;
      if (column.classList.contains('milo')) return;
      column.classList.replace('columns', 'ax-columns');
    });
  };

  const replaceTableOfContentBlock = (section) => {
    const tableOfContentBlock = section.querySelectorAll('div.table-of-contents');
    tableOfContentBlock.forEach((tableOfContent) => {
      if (tableOfContent.classList[0] !== 'table-of-contents') return;

      const config = readBlockConfig(tableOfContent);
      if (config.levels === undefined) return;
      tableOfContent.classList.replace('table-of-contents', 'ax-table-of-contents');
    });
  };

  const replaceMarqueeBlock = (section) => {
    const marquees = section.querySelectorAll('div.marquee');
    marquees.forEach((marquee) => {
      const firstRow = marquee.querySelector(':scope > div:first-of-type');
      const isExpressMarquee = firstRow.children.length > 1
        && ['default', 'mobile', 'desktop', 'hd'].includes(firstRow.querySelector(':scope > div')?.textContent?.trim().toLowerCase());
      if (isExpressMarquee) {
        marquee.classList.replace('marquee', 'ax-marquee');
        const links = marquee.querySelectorAll(':scope a');
        links.forEach((link) => {
          link.textContent = link.textContent.replace('{{business-sales-numbers}}', '((business-sales-numbers))');
          link.textContent = link.textContent.replace('{{pricing}}', '((pricing))');
        });
      }
    });
  };

  if (!area) return;
  area.querySelectorAll(selector).forEach((section) => {
    replaceColumnBlock(section);
    replaceTableOfContentBlock(section);
    replaceMarqueeBlock(section);
  });
}

// Get lottie animation HTML - remember to lazyLoadLottiePlayer() to see it.
export function getLottie(name, src, loop = true, autoplay = true, control = false, hover = false) {
  return (`<lottie-player class="lottie lottie-${name}" src="${src}" background="transparent" speed="1" ${(loop) ? 'loop ' : ''}${(autoplay) ? 'autoplay ' : ''}${(control) ? 'controls ' : ''}${(hover) ? 'hover ' : ''}></lottie-player>`);
}

// Lazy-load lottie player if you scroll to the block.
export function lazyLoadLottiePlayer($block = null) {
  const usp = new URLSearchParams(window.location.search);
  const lottie = usp.get('lottie');
  if (lottie !== 'off') {
    const loadLottiePlayer = () => {
      if (window['lottie-player']) return;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '/express/code/scripts/lottie-player.1.5.6.js';
      document.head.appendChild(script);
      window['lottie-player'] = true;
    };
    if ($block) {
      const addIntersectionObserver = (block) => {
        const observer = (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            if (entry.intersectionRatio >= 0.25) {
              loadLottiePlayer();
            }
          }
        };
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: [0.0, 0.25],
        };
        const intersectionObserver = new IntersectionObserver(observer, options);
        intersectionObserver.observe(block);
      };
      if (document.readyState === 'complete') {
        addIntersectionObserver($block);
      } else {
        window.addEventListener('load', () => {
          addIntersectionObserver($block);
        });
      }
    } else if (document.readyState === 'complete') {
      loadLottiePlayer();
    } else {
      window.addEventListener('load', () => {
        loadLottiePlayer();
      });
    }
  }
}

export function buildAutoBlocks() {
  if (document.querySelector('main >.section:last-of-type .floating-button')) return;
  if (['yes', 'y', 'true', 'on'].includes(getMetadata('show-floating-cta')?.toLowerCase())) {
    const lastDiv = document.querySelector('main > div:last-of-type');
    const newDiv = document.createElement('div');
    lastDiv.insertAdjacentElement('afterend', newDiv);
    const validButtonVersion = ['floating-button', 'multifunction-button', 'mobile-fork-button', 'mobile-fork-button-frictionless'];
    const device = document.body.dataset?.device;
    const blockName = getMetadata(`${device}-floating-cta`);

    if (blockName && validButtonVersion.includes(blockName) && newDiv) {
      const button = createTag('div', { class: blockName });
      const colEl = createTag('div', {}, device);
      button.appendChild(colEl);
      button.classList.add('meta-powered');
      newDiv.append(button);
      import('./block-mediator.min.js').then((mod) => {
        mod.default.set('floatingCtasLoaded', true);
      });
    }
  }
}

function fragmentBlocksToLinks(area) {
  area.querySelectorAll('div.fragment').forEach((blk) => {
    const fragLink = blk.querySelector('a');
    if (fragLink) {
      const p = document.createElement('p');
      p.append(fragLink);
      blk.replaceWith(p);
    }
  });
}

const blocksToClean = [
  {
    selector: '.pricing-cards',
    placeholders: [
      '{{gradient-promo}}',
      '{{pricing}}',
      '{{savePercentage}}',
      '{{special-promo}}',
      '{{per-month}}',
      '{{per-year}}',
      '{{per-month-per-seat}}',
      '{{per-year-per-seat}}',
      '{{vat-include-text}}',
      '{{vat-exclude-text}}',
      '{{business-sales-numbers}}',
    ],
  },
  {
    selector: '.cta-carousel',
    placeholders: [
      '{{prompt-text}}',
      '%7B%7Bprompt-text%7D%7D',
    ],
  },
  {
    selector: '.list',
    placeholders: [
      '{{pricing.formatted}}',
      '{{pricing.formattedBP}}',
    ],
  },
];

function cleanupBrackets(area) {
  blocksToClean.forEach((block) => {
    const elements = area.querySelectorAll(block.selector);
    if (elements.length) {
      const placeholderPattern = block.placeholders.map((ph) => ph.replace('{{', '\\{\\{').replace('}}', '\\}\\}').replace('%7B%7B', '%7B%7B').replace('%7D%7D', '%7D%7D')).join('|');
      const regex = new RegExp(placeholderPattern, 'g');

      elements.forEach((element) => {
        element.innerHTML = element.innerHTML.replace(regex, (match) => match.replace(/\{\{/g, '((').replace(/\}\}/g, '))').replace(/%7B%7B/g, '((').replace(/%7D%7D/g, '))'));
      });
    }
  });
}

function addPromotion(area) {
  const customPromotion = document.querySelector('main .promotion.auto-promotion');
  const promotion = area.querySelector('main .promotion:not(.auto-promotion)');
  // check for existing promotion
  if (promotion && customPromotion) {
    customPromotion.remove();
  } else if (!promotion && !customPromotion && !document.querySelector('main .promotion')) {
    // extract category from metadata
    const category = getMetadata('category');
    if (category) {
      const promos = {
        photo: 'photoshop',
        design: 'illustrator',
        video: 'premiere',
      };
      // insert promotion at the bottom
      if (promos[category]) {
        const $promoSection = createTag('div', { class: 'section' });
        $promoSection.innerHTML = `<div class="promotion auto-promotion" data-block-name="promotion"><div><div>${promos[category]}</div></div></div>`;
        document.querySelector('main').append($promoSection);
      }
    }
  }
}

function decorateLegalCopy(area) {
  const legalCopyPrefixes = ['*', '†'];
  area.querySelectorAll('p').forEach(($p) => {
    const pText = $p.textContent.trim() ? $p.textContent.trim().charAt(0) : '';
    if (pText && legalCopyPrefixes.includes(pText)) {
      $p.classList.add('legal-copy');
    }
  });
}

function unwrapBlockDeprecated($block) {
  const $section = $block.parentNode;
  const $elems = [...$section.children];

  if ($elems.length <= 1) return;

  const $blockSection = createTag('div');
  const $postBlockSection = createTag('div');
  const $nextSection = $section.nextElementSibling;
  $section.parentNode.insertBefore($blockSection, $nextSection);
  $section.parentNode.insertBefore($postBlockSection, $nextSection);

  let $appendTo;
  $elems.forEach(($e) => {
    if ($e === $block || ($e.className === 'section-metadata')) {
      $appendTo = $blockSection;
    }

    if ($appendTo) {
      $appendTo.appendChild($e);
      $appendTo = $postBlockSection;
    }
  });

  if (!$postBlockSection.hasChildNodes()) {
    $postBlockSection.remove();
  }
}

// TODO remove this method and the unwrap block method once template-list blocks are gone
function splitSections(area, selector) {
  const blocks = area.querySelectorAll(`${selector} > .template-list`);
  blocks.forEach((block) => {
    unwrapBlockDeprecated(block);
  });
}

async function formatDynamicCartLink(a) {
  try {
    const pattern = /.*commerce.*adobe\.com.*/gm;
    if (!pattern.test(a.href)) return a;
    a.style.visibility = 'hidden';
    const [{ fetchPlanOnePlans, buildUrl }, { getConfig }] = await Promise.all([
      import('./utils/pricing.js'), import(`${getLibs()}/utils/utils.js`),
    ]);
    const { url, country, language, offerId } = await fetchPlanOnePlans(a.href);
    const newTrialHref = buildUrl(url, country, language, getConfig, offerId);
    a.href = newTrialHref;
  } catch (error) {
    window.lana.log(`Failed to fetch prices for page plan: ${error}`);
  }
  a.style.visibility = 'visible';
  return a;
}

function decorateCommerceLinks(area) {
  const blocks = getMetadata('ax-commerce-override')?.toLowerCase()?.split(',') || [];
  const selector = blocks.map((block) => `.${block.trim()} a`).join(', ');
  selector && [...area.querySelectorAll(selector)].forEach((a) => {
    formatDynamicCartLink(a);
  });
}

export function decorateArea(area = document) {
  document.body.dataset.device = navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  const selector = area === document ? 'main > div' : ':scope body > div';
  preDecorateSections(area);
  // LCP image decoration
  (function decorateLCPImage() {
    const lcpImg = area.querySelector('img');
    lcpImg?.removeAttribute('loading');
  }());

  if (area.querySelectorAll(`${selector} a[href*="adobesparkpost.app.link"], ${selector} a[href*="adobesparkpost-web.app.link"]`).length) {
    // eslint-disable-next-line import/no-cycle
    // select links again to refresh reference
    import('./branchlinks.js').then((mod) => mod.default(area.querySelectorAll(`${selector} a[href*="adobesparkpost.app.link"], ${selector} a[href*="adobesparkpost-web.app.link"]`)));
  }

  cleanupBrackets(area);
  splitSections(area, selector);
  area.querySelectorAll('a[href^="https://spark.adobe.com/"]').forEach((a) => { a.href = 'https://new.express.adobe.com'; });

  fragmentBlocksToLinks(area);
  renameConflictingBlocks(area, selector);
  addPromotion(area);
  decorateLegalCopy(area);

  const linksToNotAutoblock = [];
  const embeds = area.querySelectorAll(`${selector} > .embed a[href*="instagram.com"]`);
  linksToNotAutoblock.push(...embeds);

  let videoLinksToNotAutoBlock = ['ax-columns', 'ax-marquee', 'hero-animation', 'cta-carousel', 'frictionless-quick-action', 'fullscreen-marquee', 'template-x', 'grid-marquee', 'image-list', 'tutorials', 'quick-action-hub', 'holiday-blade'].map((block) => `${selector} .${block} a[href$=".mp4"]`).join(', ');
  videoLinksToNotAutoBlock += `,${['tutorials'].map((block) => `${selector} .${block} a[href*="youtube.com"], ${selector} .${block} a[href*="youtu.be"], ${selector} .${block} a[href$=".mp4"], ${selector} .${block} a[href*="vimeo.com"], ${selector} .${block} a[href*="video.tv.adobe.com"]`).join(', ')}`;
  linksToNotAutoblock.push(...area.querySelectorAll(videoLinksToNotAutoBlock));
  linksToNotAutoblock.forEach((link) => {
    if (!link.href.includes('#_dnb')) link.href = `${link.href}#_dnb`;
  });

  decorateCommerceLinks(area);
}

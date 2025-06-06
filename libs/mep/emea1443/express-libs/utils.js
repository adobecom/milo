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

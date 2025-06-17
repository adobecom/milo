import { readBlockConfig, addTempWrapperDeprecated } from '../express-libs/utils.js';
import { createTag } from '../../../utils/utils.js';

function decorateButton($block, $toggle) {
  const $button = createTag('button', { class: 'content-toggle-button' });
  const tagText = $toggle.textContent.trim().match(/\[(.*?)\]/);

  if (tagText) {
    const [fullText, tagTextContent] = tagText;
    const $tag = createTag('span', { class: 'tag' });
    $button.textContent = $toggle.textContent.trim().replace(fullText, '').trim();
    $button.dataset.text = $button.textContent.toLowerCase();
    $tag.textContent = tagTextContent;
    $button.append($tag);
  } else {
    $button.textContent = $toggle.textContent.trim();
    $button.dataset.text = $button.textContent.toLowerCase();
  }
  $block.append($button);
}

function getDefaultToggleIndex($block) {
  const defaultClass = Array.from($block.classList).find((cls) => /^default-\d+$/.test(cls));
  let defaultIndex;
  if (defaultClass) {
    defaultIndex = parseInt(defaultClass.split('-')[1], 10) - 1;
  } else {
    defaultIndex = 0;
  }
  return defaultIndex;
}

function initButton($block, $sections, index) {
  const $enclosingMain = $block.closest('main');

  if ($enclosingMain) {
    const $buttons = $block.querySelectorAll('.content-toggle-button');
    const setActiveButton = (newIndex) => {
      $block.querySelectorAll('.content-toggle-button').forEach(($btn) => $btn.classList.remove('active'));
      $buttons[newIndex].classList.add('active');
    };

    if (index === getDefaultToggleIndex($block)) {
      setActiveButton(index);
    }

    $buttons[index].addEventListener('click', () => {
      const $activeButton = $block.querySelector('button.active');
      // const blockPosition = $block.getBoundingClientRect().top;
      // const offsetPosition = blockPosition + window.scrollY - 80;

      if ($activeButton !== $buttons[index]) {
        setActiveButton(index);
        $sections.forEach(($section) => {
          if ($buttons[index].dataset.text === $section.dataset.toggle.toLowerCase()) {
            $section.style.display = 'block';
          } else {
            $section.style.display = 'none';
          }
        });
        // if (!(window.scrollY < offsetPosition + 1 && window.scrollY > offsetPosition - 1)) {
        //   window.scrollTo({
        //     top: offsetPosition,
        //     behavior: 'smooth',
        //   });
        // }
      }
    });
  }
}

function decorateSectionMetadata(section) {
  const metadataDiv = section.querySelector(':scope > .section-metadata');

  if (metadataDiv) {
    const meta = readBlockConfig(metadataDiv);
    const keys = Object.keys(meta);
    keys.forEach((key) => {
      if (!['style', 'anchor', 'background'].includes(key)) {
        section.setAttribute(`data-${key}`, meta[key]);
      }
    });
  }
}

function decorateSectionsMetadata() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(decorateSectionMetadata);
}

function waitForMarqueeHeight() {
  return new Promise((resolve) => {
    function check() {
      const marquees = document.querySelectorAll('[class*="marquee"]');
      for (const marquee of marquees) {
        const { height } = marquee.getBoundingClientRect();
        if (height > 0) {
          resolve(height);
          return;
        }
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

function getHoverCaretHeight() {
  if (document.querySelector('.feds-navLink--hoverCaret')) {
    const navLinkHeight = document.querySelector('.feds-navLink--hoverCaret').getBoundingClientRect().height;
    return navLinkHeight;
  }
  return 0;
}

function getElementsHeightBeforeMain() {
  const main = document.querySelector('main');
  if (!main) return 0;
  let beforeMain = main.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
  if (document.querySelector('.feds-navLink--hoverCaret')) {
    beforeMain -= document.querySelector('.global-navigation').getBoundingClientRect().height;
  }
  return beforeMain;
}

function setupStickyBehaviour() {
  const toggleWrapper = document.querySelector('.content-toggle-wrapper');
  let isFixed = false;

  let initialOffset;
  waitForMarqueeHeight().then((marqueeHeight) => {
    toggleWrapper.closest('.section').style.top = `${marqueeHeight + getHoverCaretHeight()}px`;
    initialOffset = toggleWrapper.getBoundingClientRect().top + window.scrollY;
  });

  window.addEventListener('scroll', () => {
    let marqueeHeight;
    document.querySelectorAll('[class*="marquee"]').forEach((marquee) => {
      if (marquee.getBoundingClientRect().height !== 0) {
        marqueeHeight = marquee.getBoundingClientRect().height;
      }
    });

    toggleWrapper.closest('.section').setAttribute('style', `top: ${marqueeHeight + getHoverCaretHeight()}px`);

    const { scrollY } = window;

    if (scrollY >= initialOffset - getElementsHeightBeforeMain() - 6 && !isFixed) {
      toggleWrapper.classList.add('fixed');
      toggleWrapper.setAttribute('style', `top: ${getElementsHeightBeforeMain()}px`);
      isFixed = true;
    } else if (scrollY < initialOffset - getElementsHeightBeforeMain() - 6 && isFixed) {
      toggleWrapper.classList.remove('fixed');
      toggleWrapper.removeAttribute('style');
      isFixed = false;
    }
  });
}

export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'content-toggle');
  decorateSectionsMetadata();

  const $enclosingMain = block.closest('main');
  if ($enclosingMain) {
    const $sections = $enclosingMain.querySelectorAll('[data-toggle]');
    const $toggleContainer = block.querySelector('ul');

    block.innerHTML = '';

    Array.from($toggleContainer.children).forEach(($toggle, index) => {
      decorateButton(block, $toggle);
      initButton(block, $sections, index);
    });

    if ($sections) {
      $sections.forEach(($section, index) => {
        if (index !== getDefaultToggleIndex(block)) {
          $section.style.display = 'none';
        }
      });
    }
    if (block.classList.contains('sticky')) {
      setupStickyBehaviour();
    }
  }
}

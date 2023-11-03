import { createTag } from '../../utils/utils.js';

const base = `${window.location.origin}/libs`;
const localAssetsRoot = `${base}/assets/imarquee-changebg`;

function getPicture(row, idx) {
  return row.nextElementSibling.children[idx].querySelector('picture');
}

function getImageUrl(row, idx) {
  return getPicture(row, idx)?.querySelector('img').src;
}

function getColor(row) {
  return row.nextElementSibling.children[0].innerText.trim();
}

export default async function init(el) {

  const config = {
    desktop: {},
    tablet: {},
    mobile: {}
  }

  const rows = el.querySelectorAll(':scope > div');
  const data = [...rows].reduce((acc, row) => {
    const section = row.innerText.trim().toLowerCase();
    if (section === 'background') {
      acc.background = {
        mobile: getPicture(row, 0),
        tablet: getPicture(row, 1),
        desktop: getPicture(row, 2),
      };
    } else if (section === 'foreground') {
      acc.foreground = {
        mobile: getPicture(row, 0),
        tablet: getPicture(row, 1),
        desktop: getPicture(row, 2),
      };
    } else if (section === 'text') {
      acc.text = {
        mobile: getPicture(row, 0),
        tablet: getPicture(row, 1),
        desktop: getPicture(row, 2),
      };
      const mobileImg = acc.text.mobile.querySelector('img');
      console.log(mobileImg);
      // mobileImg.width = '274px'
    } else if (section.startsWith('change photo')) {
      const idx = Number.parseInt(section.slice(-1), 10);
      acc[section] = {
        mobile: getImageUrl(row, 0),
        tablet: getImageUrl(row, 1),
        desktop: getImageUrl(row, 2),
      }
    } else if (section.startsWith('change color')) {
      const idx = Number.parseInt(section.slice(-1), 10);
      acc[section] = {
        color: getColor(row),
      }
    } else if (section.startsWith('change pattern')) {
      const idx = Number.parseInt(section.slice(-1), 10);
      acc[section] = {
        mobile: getImageUrl(row, 0),
        tablet: getImageUrl(row, 1),
        desktop: getImageUrl(row, 2),
      }
    }

    row.className = 'hide-block';
    return acc;
  }, {});

  const gradient = document.createElement('div');
  gradient.className = 'imarquee-gradient';

  const mobileComposite = createTag('div', { class: 'imarquee-composite' }, [data.background.mobile, gradient, data.foreground.mobile]);
  const mobileContainer = createTag('div', { class: 'imarquee-mobile' }, [data.text.mobile, mobileComposite]);

  const tabletComposite = createTag('div', { class: 'imarquee-composite' }, [data.background.tablet, data.foreground.tablet, data.text.tablet]);
  const tabletContainer = createTag('div', { class: 'imarquee-tablet' }, tabletComposite);

  const desktopComposite = createTag('div', { class: 'imarquee-composite' }, [data.background.desktop, data.foreground.desktop, data.text.desktop]);
  const desktopContainer = createTag('div', { class: 'imarquee-desktop' }, desktopComposite);

  el.append(mobileContainer, tabletContainer, desktopContainer);

  const marqueeEle = document.createElement('ft-changebackgroundmarquee');
  
  marqueeEle.config = {
    desktop: {
      marqueeTitleImgSrc: data.text.desktop.children[3].src,
      talentSrc: data.foreground.desktop.children[3].src,
      defaultBgSrc: data.background.desktop.children[3].src,
      tryitSrc: `${localAssetsRoot}/tryit.svg`,
      tryitText: 'Try It',
      cursorSrc: `${localAssetsRoot}/desktop/dt-mouse-arrow.svg`,
      groups: [
        {
          name: 'Remove Background',
          iconUrl: `${localAssetsRoot}/remove-background-icon.svg`
        },
        {
          name: 'Change Photo',
          iconUrl: `${localAssetsRoot}/change-photo-icon.svg`,
          options: [
            {
              src: data['change photo 1'].desktop,
              swatchSrc: ''
            },
            {
              src: data['change photo 2'].desktop,
              swatchSrc: ''
            },
            {
              src: data['change photo 3'].desktop,
              swatchSrc: ''
            },
          ]
        },
        {
          name: 'Change Color',
          iconUrl: `${localAssetsRoot}/change-color-icon.svg`,
          options: [
            { src: data['change color 1'].color, },
            { src: data['change color 2'].color },
            { src: data['change color 3'].color }
          ]
        },
        {
          name: 'Change Pattern',
          iconUrl: `${localAssetsRoot}/change-pattern-icon.svg`,
          options: [
            {
              src: data['change pattern 1'].desktop,
              swatchSrc: ''
            },
            {
              src: data['change pattern 2'].desktop,
              swatchSrc: ''
            },
            {
              src: data['change pattern 3'].desktop,
              swatchSrc: ''
            },
          ]
        }
      ]
    },
    tablet: {
      marqueeTitleImgSrc: data.text.tablet.children[3].src,
      talentSrc: data.foreground.tablet.children[3].src,
      defaultBgSrc: data.background.tablet.children[3].src,
      tryitSrc: `${localAssetsRoot}/tryit.svg`,
      tryitText: 'Try It',
      groups: [
        {
          name: 'Remove Background',
          iconUrl: `${localAssetsRoot}/remove-background-icon.svg`
        },
        {
          name: 'Change Photo',
          iconUrl: `${localAssetsRoot}/change-photo-icon.svg`,
          options: [
            {
              src: data['change photo 1'].tablet,
              swatchSrc: ''
            },
          ]
        },
        {
          name: 'Change Color',
          iconUrl: `${localAssetsRoot}/change-color-icon.svg`,
          options: [
            { src: data['change color 1'].color, },
          ]
        },
        {
          name: 'Change Pattern',
          iconUrl: `${localAssetsRoot}/change-pattern-icon.svg`,
          options: [
            {
              src: data['change pattern 1'].tablet,
              swatchSrc: ''
            },
          ]
        }
      ]
    },
    mobile: {
      marqueeTitleImgSrc: data.text.mobile.children[3].src,
      talentSrc: data.foreground.mobile.children[3].src,
      defaultBgSrc: data.background.mobile.children[3].src,
      tryitSrc: `${localAssetsRoot}/tryit.svg`,
      tryitText: 'Try It',
      groups: [
        {
          name: 'Remove Background',
          iconUrl: `${localAssetsRoot}/remove-background-icon.svg`
        },
        {
          name: 'Change Photo',
          iconUrl: `${localAssetsRoot}/change-photo-icon.svg`,
          options: [
            {
              src: data['change photo 1'].mobile,
              swatchSrc: ''
            },
          ]
        },
        {
          name: 'Change Color',
          iconUrl: `${localAssetsRoot}/change-color-icon.svg`,
          options: [
            { src: data['change color 1'].color, },
          ]
        },
        {
          name: 'Change Pattern',
          iconUrl: `${localAssetsRoot}/change-pattern-icon.svg`,
          options: [
            {
              src: data['change pattern 1'].mobile,
              swatchSrc: ''
            },
          ]
        }
      ]
    }
  }

  import(`${base}/deps/imarquee-changebg/ft-everyonechangebgmarquee-8e121e97.js`);

  marqueeEle.addEventListener('preload', (ev) => {
    marqueeEle.updateComplete.then(() => {
      marqueeEle.classList.add('loaded');
    })
  })


  console.log(marqueeEle.config);
  setTimeout(() => {
    el.append(marqueeEle);
  }, 100)

}

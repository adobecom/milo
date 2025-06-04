import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGridTable from '@adobe/remark-gridtables';
import { toHast as mdast2hast, defaultHandlers } from 'mdast-util-to-hast';
import { raw } from 'hast-util-raw';
import { mdast2hastGridTablesHandler } from '@adobe/mdast-util-gridtables';
import { toHtml } from 'hast-util-to-html';

import { JSDOM } from 'jsdom';

function toBlockCSSClassNames(text) {
  if (!text) return [];
  const names = [];
  const idx = text.lastIndexOf('(');
  if (idx >= 0) {
    names.push(text.substring(0, idx));
    names.push(...text.substring(idx + 1).split(','));
  } else {
    names.push(text);
  }

  return names
    .map((name) =>
      name
        .toLowerCase()
        .replace(/[^0-9a-z]+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    )
    .filter((name) => !!name);
}

function convertBlocks(dom) {
  const tables = dom.window.document.querySelectorAll('body > table');

  tables.forEach((table) => {
    const rows = [
      ...table.querySelectorAll(':scope > tbody > tr, :scope > thead > tr'),
    ];
    const nameRow = rows.shift();
    const divs = rows.map((row) => {
      const cols = row.querySelectorAll(':scope > td, :scope > th');
      // eslint-disable-next-line no-shadow
      const divs = [...cols].map((col) => {
        const { innerHTML } = col;
        const div = dom.window.document.createElement('div');
        div.innerHTML = innerHTML;
        return div;
      });
      const div = dom.window.document.createElement('div');
      div.append(...divs);
      return div;
    });

    const div = dom.window.document.createElement('div');
    div.className = toBlockCSSClassNames(nameRow.textContent).join(' ');
    div.append(...divs);
    table.parentElement.replaceChild(div, table);
  });
}

function makePictures(dom) {
  const imgs = dom.window.document.querySelectorAll('img');
  imgs.forEach((img) => {
    const clone = img.cloneNode(true);
    clone.setAttribute('loading', 'lazy');
    // clone.src = `${clone.src}?optimize=medium`;

    let pic = dom.window.document.createElement('picture');

    const srcMobile = dom.window.document.createElement('source');
    srcMobile.srcset = clone.src;

    const srcTablet = dom.window.document.createElement('source');
    srcTablet.srcset = clone.src;
    srcTablet.media = '(min-width: 600px)';

    pic.append(srcMobile, srcTablet, clone);

    const hrefAttr = img.getAttribute('href');
    if (hrefAttr) {
      const a = dom.window.document.createElement('a');
      a.href = hrefAttr;
      const titleAttr = img.getAttribute('title');
      if (titleAttr) {
        a.title = titleAttr;
      }
      a.append(pic);
      pic = a;
    }

    // Determine what to replace
    const imgParent = img.parentElement;
    const imgGrandparent = imgParent.parentElement;
    if (imgParent.nodeName === 'P' && imgGrandparent?.childElementCount === 1) {
      imgGrandparent.replaceChild(pic, imgParent);
    } else {
      imgParent.replaceChild(pic, img);
    }
  });
}

function makeSections(dom) {
  const children = dom.window.document.body.querySelectorAll(':scope > *');

  const section = dom.window.document.createElement('div');
  const sections = [...children].reduce(
    (acc, child) => {
      if (child.nodeName === 'HR') {
        child.remove();
        acc.push(dom.window.document.createElement('div'));
      } else {
        acc[acc.length - 1].append(child);
      }
      return acc;
    },
    [section]
  );

  dom.window.document.body.append(...sections);
}

// Generic docs have table blocks and HRs, but not ProseMirror decorations
export function docDomToAemHtml(dom) {
  convertBlocks(dom);
  makePictures(dom);
  makeSections(dom);

  return dom.window.document.body.innerHTML;
}

function makeHast(mdast) {
  const handlers = {
    ...defaultHandlers,
    gridTable: mdast2hastGridTablesHandler(),
  };
  const hast = mdast2hast(mdast, { handlers, allowDangerousHtml: true });
  return raw(hast);
}

function removeImageSizeHash(dom) {
  const imgs = dom.window.document.querySelectorAll('[src*="#width"]');
  imgs.forEach((img) => {
    img.setAttribute('src', img.src.split('#width')[0]);
  });
}

export function mdToDocDom(md) {
  // convert linebreaks
  const converted = md.replace(/(\r\n|\n|\r)/gm, '\n');

  // convert to mdast
  const mdast = unified()
    .use(remarkParse)
    .use(remarkGridTable)
    .parse(converted);

  const hast = makeHast(mdast);

  let htmlText = toHtml(hast);
  htmlText = htmlText.replaceAll('.hlx.page', '.hlx.live');
  htmlText = htmlText.replaceAll('.aem.page', '.aem.live');

  const dom = new JSDOM(htmlText);
  removeImageSizeHash(dom);

  return dom;
}

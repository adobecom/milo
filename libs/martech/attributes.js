export function decorateBlockAnalytics(blockEl) {
  blockEl.setAttribute('daa-im', 'true');
  blockEl.setAttribute('daa-lh', [...blockEl.classList].join('|'));
}

export function decorateLinkAnalytics(textEl, headings) {
  const headingText = [...headings].map((heading) => heading.textContent);
  textEl.setAttribute('daa-lh', headingText.join('|'));
  const links = textEl.querySelectorAll('a, button');
  links.forEach((link, i) => {
    let linkType = 'link';
    const { classList } = link;
    if (classList.contains('con-button') && classList.contains('blue')) { linkType = 'filled'; }
    if (classList.contains('con-button') && classList.contains('outline')) { linkType = 'outline'; }
    const str = `${linkType}|${link.innerText} ${i + 1}`;
    link.setAttribute('daa-ll', str);
  });
}

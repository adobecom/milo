export function decorateBlockAnalytics(blockEl) {
  const lh = [];
  const exclude = ['--', 'block'];
  blockEl.classList.forEach((c) => {
    if (!c.includes(exclude[0]) && c !== exclude[1]) lh.push(c);
  });
  blockEl.setAttribute('daa-im', 'true');
  blockEl.setAttribute('daa-lh', lh.join('|'));
}

export function decorateLinkAnalytics(textEl, heading) {
  textEl.setAttribute('daa-lh', heading.textContent);
  const links = textEl.querySelectorAll('a, button');
  links.forEach((link, i) => {
    const linkType = (link.classList.contains('con-button')) ? 'cta' : 'link';
    const str = `${linkType}|${link.innerText} ${i + 1}`;
    link.setAttribute('daa-ll', str);
  });
}

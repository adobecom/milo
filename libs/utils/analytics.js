// Analytics
// Include Adobe analytics tracking attributes to the DOM
// ---
// 1) Link Hierarchy Attribute - (daa-lh) (daa-im) decorateBlockAnalytics()
// daa-im
// - Simple attribute flag if set
//   to true will capture impressions
//   for each link in that container.
// daa-lh
// - Hierarchy values that are used to
//   create a complete view of where each
//   interaction is located. Our code will
//   combine hierarchy values to create
//   where(unique identifier) for every interaction.
//
// 2) CTA Attribute - (daa-ll) decorateLinkAnalytics()
// (CTA English value-CTA number in current box)
// daa-ll
// - Interaction identifier. Such as
//   "Learn more" for a learn more link.
// ---
// PRD: Home Page Link Tracking...
// [https://wiki.corp.adobe.com/display/~cwest/PRD%3A+Home+Page+Link+Tracking]

// expects block el
export function decorateBlockAnalytics(el) {
  const lh = [];
  const exclude = ['--', 'block'];
  el.classList.forEach((c) => {
    if (!c.includes(exclude[0]) && c !== exclude[1]) lh.push(c);
  });
  el.setAttribute('daa-im', 'true');
  el.setAttribute('daa-lh', lh.join('|'));
}
// expects block text el
export function decorateLinkAnalytics(el, heading) {
  el.setAttribute('daa-lh', heading.textContent);
  const links = el.querySelectorAll('a, button');
  links?.forEach((link, i) => {
    const linkType = () => {
      if (link.classList.contains('con-button')) {
        return 'cta';
      }
      if (link.classList.contains('icon')) {
        return 'icon cta';
      }
      return 'link';
    };
    const str = `${linkType(link)}|${link.innerText} ${i + 1}`;
    link.setAttribute('daa-ll', str);
  });
}

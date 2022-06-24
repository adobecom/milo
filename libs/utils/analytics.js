// Shared analytics utils
// This adds function to include Adobe analytics tracking attributes to the DOM
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
// see link... [https://wiki.corp.adobe.com/login.action?os_destination=%2Fpages%2Fviewpage.action%3FspaceKey%3D%7Ecwest%26title%3DPRD%253A%2BHome%2BPage%2BLink%2BTracking&permissionViolation=true]

export function decorateBlockAnalytics(el) {
  const lh = [];
  const exclude = ['--', 'block'];
  el.classList.forEach((c) => {
    if (!c.includes(exclude[0]) && c !== exclude[1]) lh.push(c);
  });
  el.setAttribute('daa-im', 'true');
  el.setAttribute('daa-lh', lh.join('|'));
}

export function decorateLinkAnalytics(el, heading) {
  el.setAttribute('daa-lh', heading.textContent);
  const links = el.querySelectorAll('a, button');
  if (links) {
    links.forEach((link, i) => {
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
}

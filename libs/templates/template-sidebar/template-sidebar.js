/*

Template: Sidebar
Theme: Sidebar Left (default), Sidebar Right

Decorates a page to display the 1st & 2nd sections in a column layout.

<section-sidebar>
  <sidebar>[Section 1...]</sidebar>
  <main>[Section 2...]</main>
</section-sidebar>

If a marquee is present in the 1st section,
it will use the 2nd and 3rd sections on the page.

[Section 1 <marquee>...]
<section-sidebar>
  <sidebar>[Section 2...]</sidebar>
  <main>[Section 3...]</main>
</section-sidebar>

 */

function handleSectionSidebar(section) {
  const sidebar = section.previousElementSibling;
  sidebar.classList.add('section-1');
  section.classList.add('section-2');
  if (sidebar) {
    const sidebarContainer = document.createElement('div');
    const sidebarWrapper = document.createElement('div');
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    sidebarContainer.classList.add('section-sidebar');
    sidebarWrapper.classList.add('sidebar-wrapper', 'container');
    if (section.style) sidebarContainer.style.backgroundColor = section.style.backgroundColor;
    section.insertAdjacentElement('afterend', sidebarContainer);
    col1.classList.add('sidebar-col-1');
    col2.classList.add('sidebar-col-2');
    col1.insertAdjacentElement('afterbegin', sidebar);
    col2.insertAdjacentElement('afterbegin', section);
    sidebarWrapper.insertAdjacentElement('afterbegin', col1);
    sidebarWrapper.insertAdjacentElement('beforeend', col2);
    sidebarContainer.insertAdjacentElement('beforeend', sidebarWrapper);
  }
}

export default function init() {
  const sections = document.querySelectorAll('body > main > div.section');
  let startingIndex = sections[0].querySelector('div.marquee') ? 2 : 1;
  console.log('sections', sections, startingIndex);
  handleSectionSidebar(sections[startingIndex])
}

init();


function handleSectionAside(value, section) {
  // console.log('sectionAside(value, section)', {value}, {section});
  const aside = section.previousSibling;
  aside.classList.add('aside-aside');
  section.classList.add('aside-main');
  if (aside) {
    const asideContainer = document.createElement('div');
    const asideWrapper = document.createElement('div');
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    asideContainer.classList.add('aside-container', value);
    asideWrapper.classList.add('aside-wrapper', 'container');
    if (section.style) asideContainer.style.backgroundColor = section.style.backgroundColor;
    section.insertAdjacentElement('afterend', asideContainer);
    col1.classList.add('aside-col-1');
    col2.classList.add('aside-col-2');
    col1.insertAdjacentElement('afterbegin', aside);
    col2.insertAdjacentElement('afterbegin', section);
    asideWrapper.insertAdjacentElement('afterbegin', col1);
    asideWrapper.insertAdjacentElement('beforeend', col2);
    asideContainer.insertAdjacentElement('beforeend', asideWrapper);
  }
}

export default function init() {
  const sections = document.querySelectorAll('body > main > div.section');
  const colClasses = ['left-aside', 'right-aside'];
  sections.forEach((section) => {
    const classes = section.classList;
    classes?.forEach((c) => {
      if (colClasses.indexOf(c) > -1) {
        handleSectionAside(c, section)
      }
    });
  });
}

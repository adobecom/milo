export default function getItems() {
  const listItems = document.querySelectorAll('header nav.breadcrumbs ul li');
  return [...listItems].map((li) => {
    const a = li.querySelector('a');
    if (a) {
      return {
        href: a.getAttribute('href'),
        title: a.textContent,
      };
    }
    return {
      href: '',
      title: li.textContent,
    };
  });
}

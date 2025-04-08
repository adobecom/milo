(function delist() {
  const delisted = document.querySelectorAll('.aside, .z-pattern, .marquee');
  delisted.forEach((block) => {
    block.classList.add('delisted');
  });
}());

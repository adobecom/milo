(() => {
  try {
    const head = document.head;
    if (!head) return;
    if (head.querySelector('meta[name="footer-foundation"]')) return;
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'footer-foundation');
    meta.setAttribute('content', 'c2');
    head.append(meta);
  } catch {  }
})();

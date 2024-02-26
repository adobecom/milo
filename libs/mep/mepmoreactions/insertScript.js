setTimeout(() => {
  document.querySelector('main > :last-child').insertAdjacentHTML('beforeend', `<div class="text-block">
    <div class="foreground">
      <div data-valign="middle" class="quote">
        <p>This text was inserted by insertScript.</p>
      </div>
    </div>
  </div>`);
}, 1000);

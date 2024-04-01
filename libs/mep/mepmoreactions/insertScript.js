setTimeout(() => {
  document.querySelector('main > :last-child').insertAdjacentHTML('beforeend', `<div class="text-block">
    <div class="foreground">
      <div data-valign="middle">
        <p>This text was inserted by insertScript.</p>
      </div>
    </div>
  </div>`);
}, 1000);

// update

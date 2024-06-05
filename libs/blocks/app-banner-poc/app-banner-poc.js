export default function init(el) {
  console.log(el.previousElementSibling);
  const banner = document.querySelector('.aside.promobar').closest('.section');
  banner.classList.add('app-banner-sec');
  const button = banner.querySelector('a');
  if (button) {
    button.classList.remove('con-button', 'outline', 'button-l');
    button.classList.add('app-banner-button');
  }
  document.querySelector('.app-banner-con').append(banner);
}

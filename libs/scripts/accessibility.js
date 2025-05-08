export const setDialogAndElementAttributes = ({ element, title }) => {
  if (!element || !title) return;
  element.title = title;
  element.closest('.dialog-modal')?.setAttribute('aria-label', title);
};

export default function init() {
}

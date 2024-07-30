import { setViewport } from '@web/test-runner-commands';

export const delay = (ms = 0) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const keyDown = async (key) => {
    document.activeElement.dispatchEvent(
        new KeyboardEvent('keydown', {
            key,
            code: key,
            bubbles: true,
            cancelable: true,
        }),
    );
    return new Promise((resolve) => {
        setTimeout(resolve, 100);
    });
};

export async function toggleLargeDesktop() {
    try {
        await setViewport({ width: 1600, height: 1400 });
    } catch {}
}

window.skipTests = () => {
    window.location.hash = '';
    sessionStorage.setItem('skipTests', 'true');
    window.location.reload();
};

window.runTests = () => {
    sessionStorage.removeItem('skipTests');
    window.location.reload();
};

window.toggleMocks = () => {
    document.body.classList.toggle('mock');
};

window.toggleRTL = () => {
    const html = document.querySelector('html');
    html.setAttribute(
        'dir',
        html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl',
    );
};

export const appendMiloStyles = () => {
    const params = new URLSearchParams(window.location.search);
    let milolibs =
        params.get('milolibs') ?? 'https://main--milo--adobecom.hlx.live';
    if (milolibs === 'local') {
        milolibs = 'http://localhost:6456';
    }
    const customStyles = document.querySelector('style');
    let style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `${milolibs}/libs/styles/styles.css`;
    document.head.insertBefore(style, customStyles);

    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `${milolibs}/libs/blocks/merch/merch.css`;

    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `${milolibs}/libs/blocks/merch-card/merch-card.css`;
    document.head.insertBefore(style, customStyles);
};

/**
 * simple click API on a web component is sometimes overriden by SWC, this
 * calls both elt's click & prototype's
 * @param {*} elt
 */
export const elementClick = async (elt) => {
    elt.click();
    HTMLElement.prototype.click.call(elt);
    await delay(20);
};

/**
 * emulate page refresh for a webcomponent by deconnecting & reconnecting it from DOM
 * @param {*} comp web component you want to refresh
 */
export const refreshElement = async (comp) => {
    const parent = comp.parentNode;
    comp.remove();
    parent.appendChild(comp);
    await delay(20);
};

export const resetState = async () => {
    window.location.hash = '';
    await delay(1);
};

export const getTemplateContent = (template) => {
  const templateEl = document.getElementById(template);
  // @ts-ignore
  const templateContent = templateEl.content.cloneNode(true);
  return [...templateContent.children];
};

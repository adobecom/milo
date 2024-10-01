import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import { createC2pa, selectFormattedGenerator, selectEditsAndActivity } from '../../deps/cai-tools.min.js';

const miloLibs = getConfig().miloLibs ?? '/libs';
loadStyle(`${miloLibs}/blocks/cai/cai.css`);

const tooltipContent = ({ issuer, date, info, app, aiTool }) => `
      <div class="title">
        <h3>Content Credentials</h3>
        <p id="cai-subtitle">Issued by ${issuer} on ${date}</p>
      </div>
        <hr />
      <div class="content">
        <p>${info}</p>
        <hr />
        <p><b>App or device used </b> ${app}</p>
        <hr />
        <p><b>AI tool used </b> ${aiTool}</p>
      </div>
  `;

const loader = '<div class="loader"></div>';

const extractMetadata = async (img) => {
  const c2pa = await createC2pa({
    wasmSrc:
      `${miloLibs}/deps/cai-toolkit.wasm`,
    workerSrc:
      `${miloLibs}/deps/cai-worker.min.js`,
  });

  try {
    // Read in our sample image and get a manifest store
    const [src] = img.src.split('?');
    const { manifestStore } = await c2pa.read(src);

    // Get the active manifest
    const { activeManifest } = manifestStore;
    const { issuer, time } = activeManifest.signatureInfo;
    const date = new Date(time).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const app = selectFormattedGenerator(activeManifest);
    console.log(await selectEditsAndActivity(activeManifest));
    return { issuer, date, info: 'soup', app };
  } catch (err) {
    console.error('Error reading image:', err);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      issuer: 'Adobe inc.',
      date: 'Oct 1, 2024',
      info: 'This image combines multiple pieces of content. At least one was generated with an AI tool.',
      app: 'Adobe Photoshop',
      aiTool: 'Adobe Firefly',
    }), 3000);
  });
};

export default ({ img, container, caiIcon }) => {
  let metadataPromise;
  let metadata;
  const tooltip = createTag('div');
  tooltip.classList.add('hide');
  tooltip.classList.add('cai-tooltip');
  container.appendChild(tooltip);
  caiIcon.addEventListener('pointerover', () => {
    metadataPromise = metadataPromise ?? extractMetadata(img); // preload on hover
  }, { once: true });
  caiIcon.addEventListener('click', async () => {
    tooltip.classList.remove('hide');
    if (!metadata) {
      tooltip.innerHTML = loader;
      tooltip.classList.add('loading');
      metadata = await (metadataPromise ?? extractMetadata(img));
      tooltip.classList.remove('loading');
    }
    tooltip.innerHTML = tooltipContent(metadata);
  });
  tooltip.addEventListener('pointerleave', () => {
    tooltip.classList.add('hide');
  });
};

import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import { createC2pa, selectFormattedGenerator, selectEditsAndActivity, createL2ManifestStore, selectGenerativeInfo, generateVerifyUrl } from '../../deps/cai-tools.min.js';

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

  const generativeInfoTypes = {
    compositeWithTrainedAlgorithmicMedia: 'This image has been augmented, corrected or enhanced using a Generative AI model, such as with inpainting or outpainting operations',
    trainedAlgorithmicMedia: 'This image has been created algorithmically using an Artificial Intellgence model trained on captured content',
    default: 'An AI tool was not used in creating this image',
  };

  const parseGenerativeInfo = (xs) => {
    // the only two options at this point are compositeWithTrainedAlgorithmicMedia
    // and trainedAlgorithmic media, and the former overrides the latter
    const aiTool = [...new Set(xs.map(({ softwareAgent }) => softwareAgent))].join(', ') ?? 'None';
    const composite = xs.find(({ type }) => type === 'compositeWithTrainedAlgorithmicMedia');
    if (composite) {
      return {
        info: generativeInfoTypes.compositeWithTrainedAlgorithmicMedia,
        aiTool,
      };
    }
    const trained = xs.find(({ type }) => type === 'trainedAlgorithmicMedia');
    if (trained) {
      return {
        info: generativeInfoTypes.trainedAlgorithmicMedia,
        aiTool,
      };
    }
    return {
      info: generativeInfoTypes.default,
      aiTool,
    };
  };

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
    const generativeInfo = await selectGenerativeInfo(activeManifest);
    const { info, aiTool } = parseGenerativeInfo(generativeInfo);
    return { issuer, date, info, app, aiTool };
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

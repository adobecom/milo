import { html, useState, useRef, render } from '../../deps/htm-preact.js';

// API configuration - update these URLs to match your backend
const API_URL = 'http://10.193.68.37:5000';

// API functions
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });

  if (!res.ok) {
    throw new Error('Upload failed');
  }
  const { fileName } = await res.json();
  return fileName;
};

const applyEffect = async (effect, fileName) => {
  const res = await fetch(`${API_URL}/${effect}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName }),
  });
  if (!res.ok) {
    throw new Error('Processing failed');
  }
  const { modifiedImageUrl } = await res.json();
  return `${API_URL}${modifiedImageUrl}`;
};

const processImage = async (prompt, fileName, modifiedName) => {
  const res = await fetch(`${API_URL}/process-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: modifiedName || fileName, prompt }),
  });
  if (!res.ok) {
    throw new Error('Processing failed');
  }
  const { modifiedImageUrl } = await res.json();
  return {
    modifiedImageUrl: `${API_URL}${modifiedImageUrl}`,
    modifiedImagePath: modifiedImageUrl,
  };
};

// Get base path for assets
function getAssetPath(filename) {
  const blockPath = import.meta.url.replace('/artify.js', '');
  return `${blockPath}/assets/${filename}`;
}

// Effect images data
const effectImages = [
  { img: getAssetPath('effects/effect1.png'), title: 'Effect 1', key: 'customEffect1' },
  { img: getAssetPath('effects/effect2.png'), title: 'Effect 2', key: 'customEffect2' },
  { img: getAssetPath('effects/effect3.png'), title: 'Effect 3', key: 'customEffect3' },
  { img: getAssetPath('effects/effect4.png'), title: 'Effect 4', key: 'customEffect4' },
  { img: getAssetPath('effects/effect5.png'), title: 'Effect 5', key: 'customEffect5' },
  { img: getAssetPath('effects/effect6.png'), title: 'Effect 6', key: 'customEffect6' },
];

// Landing Page Component
function LandingPage({ onFileChange }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return html`
    <div class="artify-landing">
      <div class="main-wrapper">
        <img src="${getAssetPath('banner.png')}" class="banner-img" alt="banner" />
      </div>
      <div class="info">
        <h2>Add magic and transform your images in one go</h2>
        <div class="artify-upload-container">
          <div>
            <button class="artify-upload-btn" onClick=${handleButtonClick}>Choose a photo</button>
            <input
              type="file"
              ref=${fileInputRef}
              style="display: none"
              accept="image/*"
              onChange=${onFileChange}
            />
            <div class="artify-upload-info">or Drag and Drop images</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Effects Component
function Effects({ fileName, onFileUrlChange, onLoadingChange, onImageStateChange }) {
  const handleImageClick = async (effect) => {
    onLoadingChange(true);
    try {
      const urlImg = await applyEffect(effect, fileName);
      onFileUrlChange(urlImg);
      onImageStateChange('modified');
    } catch (error) {
      // Error applying effect
    } finally {
      onLoadingChange(false);
    }
  };

  return html`
    <div class="artify-effects-grid">
      ${effectImages.map((item) => html`
        <button
          key=${item.key}
          class="artify-effect-item"
          onClick=${() => handleImageClick(item.key)}
        >
          <img src=${item.img} alt=${item.title} />
        </button>
      `)}
    </div>
  `;
}

// Sidebar Component
function Sidebar({ fileName, onFileUrlChange, onLoadingChange, onImageStateChange, onFileChange }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return html`
    <div class="artify-sidebar">
      <div class="artify-sidebar-header">
        <div class="artify-sidebar-icon">+</div>
        <h3 class="artify-sidebar-title">Reference effects</h3>
      </div>
      
      <div class="artify-sidebar-actions">
        <button class="artify-upload-btn-sidebar" onClick=${handleUploadClick}>
          📤 Upload Image
        </button>
        <button class="artify-browse-btn">
          🖼️ Browse gallery
        </button>
        <input
          type="file"
          ref=${fileInputRef}
          style="display: none"
          accept="image/*"
          onChange=${onFileChange}
        />
      </div>
      
      <${Effects}
        fileName=${fileName}
        onFileUrlChange=${onFileUrlChange}
        onLoadingChange=${onLoadingChange}
        onImageStateChange=${onImageStateChange}
      />
    </div>
  `;
}

// Header Component
function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return html`
    <div class="artify-header">
      <div class="artify-logo-section">
        <img src="${getAssetPath('logo.png')}" class="logo" alt="Artify" />
      </div>
      
      <div class="artify-title-section">
        <h2 class="artify-title">Artify untitled - ${currentDate}</h2>
      </div>
      
      <div class="artify-header-actions">
        <button class="artify-header-action-btn" title="Undo">↶</button>
        <button class="artify-header-action-btn" title="Redo">↷</button>
        <button class="artify-download-btn">Download</button>
        <button class="artify-share-btn">📤 Share</button>
      </div>
    </div>
  `;
}

// Main Content Component
function MainContent({
  fileUrl,
  originalFile,
  uploading,
  imageState,
  onFileUrlChange,
  onImageStateChange,
  secondFileUrl,
  secondUploading,
  onSecondFileChange,
}) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransformed, setIsTransformed] = useState(false);
  const secondFileInputRef = useRef(null);

  const handleAddMoreClick = () => {
    if (secondFileInputRef.current) {
      secondFileInputRef.current.click();
    }
  };

  const handleCommandSubmit = async () => {
    setIsLoading(true);
    try {
      // Show loader for 1.5 seconds before displaying result.jpg
      await new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });

      // Replace the image with result.jpg from assets folder
      const resultImagePath = getAssetPath('result.jpg');
      onFileUrlChange(resultImagePath);
      onImageStateChange('modified');
      setPrompt('');
      setIsTransformed(true);
    } catch (error) {
      // Error processing image
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadJSON = () => {
    // Create sample action JSON
    const actionData = {
      action: 'image_transformation',
      timestamp: new Date().toISOString(),
      prompt: prompt || 'Transform image',
      source_image: 'original.jpg',
      result_image: 'result.jpg',
      transformation_details: {
        effect_applied: 'AI Enhancement',
        processing_time: '1.5s',
        status: 'completed',
      },
      metadata: {
        tool: 'Artify',
        version: '1.0.0',
      },
    };

    // Convert to JSON string with formatting
    const jsonString = JSON.stringify(actionData, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'action.json';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggle = () => {
    onImageStateChange(imageState === 'original' ? 'modified' : 'original');
  };

  const currentImageUrl = imageState === 'modified' ? fileUrl : originalFile;
  const showLoading = isLoading || uploading;

  return html`
    <div class="artify-main-content">
      <div class="artify-image-section">
        <div class="artify-images-wrapper">
          <div class="artify-image-container ${showLoading ? 'loading' : ''}">
            <img 
              src=${currentImageUrl}
              alt="Current Image"
            />
            ${showLoading && html`<div class="artify-loader"><div class="artify-spinner"></div></div>`}
            <button
              class="artify-toggle-button"
              disabled=${!imageState}
              onClick=${handleToggle}
              title=${imageState === 'modified' ? 'Show Original' : 'Show Modified'}
            >
              <i class=${imageState === 'modified' ? 'fa-solid fa-rotate-left' : 'fa-jelly fa-regular fa-sparkles'}></i>
            </button>
          </div>
          ${!secondFileUrl && html`
            <div class="artify-add-more-container">
              <button class="artify-add-more-btn" onClick=${handleAddMoreClick} title="Add another image">
                <i class="fa-solid fa-plus"></i>
              </button>
              <input
                type="file"
                ref=${secondFileInputRef}
                style="display: none"
                accept="image/*"
                onChange=${onSecondFileChange}
              />
            </div>
          `}
          ${secondFileUrl && html`
            <div class="artify-image-container ${secondUploading ? 'loading' : ''}">
              <img 
                src=${secondFileUrl}
                alt="Second Image"
              />
              ${secondUploading && html`<div class="artify-loader"><div class="artify-spinner"></div></div>`}
            </div>
          `}
        </div>
      </div>
      
      <div class="artify-command-section">
        <h3 class="artify-command-title">
          ${isTransformed ? 'Image transformed successfully!' : 'Enter your prompt or tutorial link:'}
        </h3>
        ${isTransformed ? html`
          <button class="artify-download-json-btn" onClick=${handleDownloadJSON}>
            Download Action JSON
          </button>
        ` : html`
          <div class="artify-command-container">
            <form class="artify-command-form" onSubmit=${(e) => { e.preventDefault(); if (prompt.trim()) handleCommandSubmit(); }}>
              <input
                class="artify-command-input"
                value=${prompt}
                onChange=${(e) => setPrompt(e.target.value)}
                placeholder="Type your command"
                aria-label="Type your command"
              />
              <button type="submit" class="artify-command-submit" aria-label="send">
                 <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2A5787"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
              </button>
            </form>
          </div>
        `}
      </div>
    </div>
  `;
}

// Editor Component
function Editor({
  fileName,
  fileUrl,
  originalFile,
  uploading,
  onFileUrlChange,
  onSecondFileChange,
  secondFileUrl,
  secondUploading,
}) {
  const [imageState, setImageState] = useState('');

  return html`
    <div class="artify-editor-wrapper">
      <div class="artify-main">
        <div class="artify-content">
          <${MainContent}
            fileName=${fileName}
            fileUrl=${fileUrl}
            originalFile=${originalFile}
            uploading=${uploading}
            imageState=${imageState}
            onFileUrlChange=${onFileUrlChange}
            onImageStateChange=${setImageState}
            onSecondFileChange=${onSecondFileChange}
            secondFileUrl=${secondFileUrl}
            secondUploading=${secondUploading}
          />
        </div>
      </div>
    </div>
  `;
}

// Main App Component
function ArtifyApp() {
  const [fileName, setFileName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [originalFile, setOriginalFile] = useState('');
  const [secondFileUrl, setSecondFileUrl] = useState(null);
  const [secondUploading, setSecondUploading] = useState(false);

  const handleFileChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setFileUrl(objectUrl);
    setOriginalFile(objectUrl);
    try {
      const uploadedFileName = await uploadImage(file);
      setFileName(uploadedFileName);
    } catch (error) {
      // Upload failed
    } finally {
      setUploading(false);
    }
  };

  const handleSecondFileChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    setSecondUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setSecondFileUrl(objectUrl);
    try {
      await uploadImage(file);
    } catch (error) {
      // Upload failed
    } finally {
      setSecondUploading(false);
    }
  };

  return html`
    <div class="artify">
      <div class="artify-container">
        ${fileUrl ? html`
          <${Editor}
            fileName=${fileName}
            fileUrl=${fileUrl}
            originalFile=${originalFile}
            uploading=${uploading}
            onFileUrlChange=${setFileUrl}
            onLoadingChange=${setUploading}
            onFileChange=${handleFileChange}
            secondFileUrl=${secondFileUrl}
            secondUploading=${secondUploading}
            onSecondFileChange=${handleSecondFileChange}
          />
        ` : html`
          <${LandingPage} onFileChange=${handleFileChange} />
        `}
      </div>
    </div>
  `;
}

// Main init function for the block
export default async function init(el) {
  // Add any additional setup here if needed
  render(html`<${ArtifyApp} />`, el);
}

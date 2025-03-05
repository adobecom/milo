/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

import { render, html, useState, useEffect, useCallback } from '../../deps/htm-preact.js';

async function loadProductMetadata(path = '/libs/blocks/bc-uar-metadata/product-data.json') {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load product data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading product metadata:', error);
    return {};
  }
}

// Function to handle JSON file uploads
async function handleJsonFileUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

// Default product template with all required fields based on the provided example
const DEFAULT_PRODUCT_TEMPLATE = {
  title: '',
  description: '',
  page: '',
  learning_resource: '',
  details: [],
  image: '',
  video_url: '',
  background_color: '#f5f5f5',
  logo: '',
  targeted_segments: {
    student: {
      plan: '',
      primary: {
        text: '',
        url: '',
      },
      secondary: {
        text: '',
        url: '',
      },
    },
  },
  primary: {
    text: 'Start free trial',
    url: '',
  },
  secondary: {
    text: 'See plans & pricing',
    url: '',
  },
};

// Check if a URL is valid and accessible
async function checkUrlStatus(url) {
  try {
    if (!url || !url.trim()) {
      return { status: 0, ok: false };
    }

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
    });

    return {
      status: response.status,
      ok: response.ok,
      redirected: response.redirected,
      finalUrl: response.url,
    };
  } catch (error) {
    console.warn(`Error checking URL ${url}:`, error);
    return { status: 0, ok: false };
  }
}

const App = () => {
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'editor', 'preview', or 'split'
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  const [urlStatus, setUrlStatus] = useState({});
  const [autoCheckUrls, setAutoCheckUrls] = useState(true); // New state for auto-checking URLs
  const [showTemplate, setShowTemplate] = useState(false); // Add this line

  // Define handleCheckUrl before using it in useEffect
  const handleCheckUrl = useCallback(async (url, fieldKey, showLoading = true) => {
    if (showLoading) {
      setUrlStatus((prevStatus) => ({
        ...prevStatus,
        [fieldKey]: { status: 'checking' },
      }));
    }

    const result = await checkUrlStatus(url);

    setUrlStatus((prevStatus) => ({
      ...prevStatus,
      [fieldKey]: {
        status: result.ok ? 'valid' : 'invalid',
        details: result,
      },
    }));
  }, []);

  // Function to open URL in new tab
  const handleOpenUrl = (url) => {
    if (url && url.trim()) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await loadProductMetadata();
      setMetadata(data);
      // Set first product as selected if available
      const productKeys = Object.keys(data);
      if (productKeys.length > 0) {
        setSelectedProduct(productKeys[0]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Now useEffect can use handleCheckUrl
  useEffect(() => {
    if (autoCheckUrls && selectedProduct && metadata[selectedProduct]) {
      const product = metadata[selectedProduct];
      const urlFields = ['page', 'learning_resource', 'video_url', 'image', 'logo'];

      // Check all direct URL fields
      urlFields.forEach((field) => {
        if (product[field] && product[field].trim()) {
          handleCheckUrl(product[field], field, false);
        }
      });

      // Check primary/secondary button URLs
      if (product.primary?.url) {
        handleCheckUrl(product.primary.url, 'primary.url', false);
      }
      if (product.secondary?.url) {
        handleCheckUrl(product.secondary.url, 'secondary.url', false);
      }

      // Check targeted segments URLs
      if (product.targeted_segments) {
        Object.entries(product.targeted_segments).forEach(([segmentKey, segment]) => {
          if (segment.primary?.url) {
            handleCheckUrl(segment.primary.url, `targeted_segments.${segmentKey}.primary.url`, false);
          }
          if (segment.secondary?.url) {
            handleCheckUrl(segment.secondary.url, `targeted_segments.${segmentKey}.secondary.url`, false);
          }
        });
      }
    }
  }, [selectedProduct, autoCheckUrls, metadata, handleCheckUrl]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    // Reset URL status when changing products
    setUrlStatus({});
  };

  const handleFieldChange = (key, value) => {
    if (!selectedProduct) return;
    const updatedProduct = {
      ...metadata[selectedProduct],
      [key]: value,
    };
    setMetadata({
      ...metadata,
      [selectedProduct]: updatedProduct,
    });
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    const newProductKey = prompt('Enter a unique product key:');
    if (!newProductKey || metadata[newProductKey]) {
      alert('Please provide a unique product key');
      return;
    }

    const newProductTitle = prompt('Enter product title:');
    if (!newProductTitle) return;

    const newProductDesc = prompt('Enter product description:');

    // Create new product with basic structure and template defaults
    const updatedMetadata = {
      ...metadata,
      [newProductKey]: {
        ...DEFAULT_PRODUCT_TEMPLATE,
        title: newProductTitle,
        description: newProductDesc || '',
      },
    };

    setMetadata(updatedMetadata);
    setSelectedProduct(newProductKey);
  };

  // Handle removing a product
  const handleRemoveProduct = () => {
    if (!selectedProduct) return;

    if (confirm(`Are you sure you want to remove "${metadata[selectedProduct]?.title || selectedProduct}"?`)) {
      const updatedMetadata = { ...metadata };
      delete updatedMetadata[selectedProduct];

      setMetadata(updatedMetadata);

      // Select another product if available
      const productKeys = Object.keys(updatedMetadata);
      if (productKeys.length > 0) {
        setSelectedProduct(productKeys[0]);
      } else {
        setSelectedProduct('');
      }
    }
  };

  // Handle exporting JSON
  const handleExportJSON = () => {
    const jsonData = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle saving data (mock implementation)
  const handleSaveData = () => {
    setSaveStatus('saving');

    // Simulate API call
    setTimeout(() => {
      // In a real implementation, you would send the data to your backend
      console.log('Saving data:', metadata);
      setSaveStatus('saved');

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  // Add this function to handle showing the template
  const handleShowTemplate = () => {
    setShowTemplate(true);
  };

  // Add this function to handle closing the template modal
  const handleCloseTemplate = () => {
    setShowTemplate(false);
  };

  // Add these new handlers
  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const jsonData = await handleJsonFileUpload(file);
      setMetadata(jsonData);
      setSaveStatus('saved');
      alert('JSON file successfully loaded');
    } catch (error) {
      console.error('Error uploading JSON:', error);
      alert(`Error uploading JSON: ${error.message}`);
    }
  };

  const handleJsonPaste = () => {
    const jsonText = prompt('Paste your JSON data here:');
    if (!jsonText) return;

    try {
      const jsonData = JSON.parse(jsonText);
      setMetadata(jsonData);
      setSaveStatus('saved');
      alert('JSON data successfully loaded');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert(`Error parsing JSON: ${error.message}`);
    }
  };

  const renderProductEditor = () => {
    if (!selectedProduct || !metadata[selectedProduct]) {
      return html`<div class="no-product-selected">No product selected</div>`;
    }
    const product = metadata[selectedProduct];

    return html`
      <div class="product-editor">
        <h2>Edit Product</h2>
        
        <div class="editor-options">
          <label class="auto-check-container">
            <input 
              type="checkbox" 
              checked=${autoCheckUrls} 
              onChange=${() => setAutoCheckUrls(!autoCheckUrls)}
            />
            <span>Auto-check URLs</span>
          </label>
        </div>
        
        <form>
          ${Object.entries(product).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // Handle complex objects
      if (key === 'targeted_segments') {
        return html`
          <div class="complex-field-container">
            <h3 class="complex-field-label">Targeted Segments</h3>
            ${Object.entries(value).map(([segmentKey, segmentValue]) => html`
              <div class="segment-container">
                <h4 class="segment-label">${segmentKey}</h4>
                
                <div class="field-container">
                  <label class="field-label">Plan</label>
                  <textarea 
                    class="field-input textarea"
                    value=${segmentValue.plan || ''}
                    onChange=${(e) => {
    const updatedSegments = { ...product.targeted_segments };
    updatedSegments[segmentKey] = {
      ...updatedSegments[segmentKey],
      plan: e.target.value,
    };
    handleFieldChange('targeted_segments', updatedSegments);
  }}
                    rows="4"
                    placeholder="Enter plan details"
                  ></textarea>
                </div>
                
                <div class="link-group">
                  <h5 class="link-group-label">Primary Button</h5>
                  <div class="field-container">
                    <label class="field-label">Text</label>
                    <input 
                      type="text" 
                      value=${segmentValue.primary?.text || ''}
                      onChange=${(e) => {
    const updatedSegments = { ...product.targeted_segments };
    updatedSegments[segmentKey] = {
      ...updatedSegments[segmentKey],
      primary: {
        ...updatedSegments[segmentKey].primary,
        text: e.target.value,
      },
    };
    handleFieldChange('targeted_segments', updatedSegments);
  }}
                      class="field-input"
                      placeholder="Button text"
                    />
                  </div>
                  
                  <div class="field-container">
                    <label class="field-label">URL</label>
                    <div class="url-input-group">
                      <input 
                        type="text" 
                        value=${segmentValue.primary?.url || ''}
                        onChange=${(e) => {
    const updatedSegments = { ...product.targeted_segments };
    updatedSegments[segmentKey] = {
      ...updatedSegments[segmentKey],
      primary: {
        ...updatedSegments[segmentKey].primary,
        url: e.target.value,
      },
    };
    handleFieldChange('targeted_segments', updatedSegments);
    if (autoCheckUrls && e.target.value.trim()) {
      handleCheckUrl(e.target.value, `targeted_segments.${segmentKey}.primary.url`);
    }
  }}
                        class="field-input"
                        placeholder="https://example.com"
                      />
                      <button 
                        type="button"
                        class="check-url-button"
                        onClick=${() => handleCheckUrl(segmentValue.primary?.url, `targeted_segments.${segmentKey}.primary.url`)}
                        title="Check URL validity"
                      >
                        Check
                      </button>
                      <button 
                        type="button"
                        class="open-url-button"
                        onClick=${() => handleOpenUrl(segmentValue.primary?.url)}
                        title="Open URL in new tab"
                        disabled=${!segmentValue.primary?.url}
                      >
                        Open
                      </button>
                    </div>
                    ${urlStatus[`targeted_segments.${segmentKey}.primary.url`] && html`
                      <div class=${`url-status-indicator ${urlStatus[`targeted_segments.${segmentKey}.primary.url`].status}`}>
                        ${urlStatus[`targeted_segments.${segmentKey}.primary.url`].status === 'checking' ? 'Checking...'
    : urlStatus[`targeted_segments.${segmentKey}.primary.url`].status === 'valid' ? 'URL is valid' : 'URL is invalid or unreachable'}
                      </div>
                    `}
                  </div>
                </div>
                
                <div class="link-group">
                  <h5 class="link-group-label">Secondary Button</h5>
                  <div class="field-container">
                    <label class="field-label">Text</label>
                    <input 
                      type="text" 
                      value=${segmentValue.secondary?.text || ''}
                      onChange=${(e) => {
    const updatedSegments = { ...product.targeted_segments };
    updatedSegments[segmentKey] = {
      ...updatedSegments[segmentKey],
      secondary: {
        ...updatedSegments[segmentKey].secondary,
        text: e.target.value,
      },
    };
    handleFieldChange('targeted_segments', updatedSegments);
  }}
                      class="field-input"
                      placeholder="Button text"
                    />
                  </div>
                  
                  <div class="field-container">
                    <label class="field-label">URL</label>
                    <div class="url-input-group">
                      <input 
                        type="text" 
                        value=${segmentValue.secondary?.url || ''}
                        onChange=${(e) => {
    const updatedSegments = { ...product.targeted_segments };
    updatedSegments[segmentKey] = {
      ...updatedSegments[segmentKey],
      secondary: {
        ...updatedSegments[segmentKey].secondary,
        url: e.target.value,
      },
    };
    handleFieldChange('targeted_segments', updatedSegments);
    if (autoCheckUrls && e.target.value.trim()) {
      handleCheckUrl(e.target.value, `targeted_segments.${segmentKey}.secondary.url`);
    }
  }}
                        class="field-input"
                        placeholder="https://example.com"
                      />
                      <button 
                        type="button"
                        class="check-url-button"
                        onClick=${() => handleCheckUrl(segmentValue.secondary?.url, `targeted_segments.${segmentKey}.secondary.url`)}
                        title="Check URL validity"
                      >
                        Check
                      </button>
                      <button 
                        type="button"
                        class="open-url-button"
                        onClick=${() => handleOpenUrl(segmentValue.secondary?.url)}
                        title="Open URL in new tab"
                        disabled=${!segmentValue.secondary?.url}
                      >
                        Open
                      </button>
                    </div>
                    ${urlStatus[`targeted_segments.${segmentKey}.secondary.url`] && html`
                      <div class=${`url-status-indicator ${urlStatus[`targeted_segments.${segmentKey}.secondary.url`].status}`}>
                        ${urlStatus[`targeted_segments.${segmentKey}.secondary.url`].status === 'checking' ? 'Checking...'
    : urlStatus[`targeted_segments.${segmentKey}.secondary.url`].status === 'valid' ? 'URL is valid' : 'URL is invalid or unreachable'}
                      </div>
                    `}
                  </div>
                </div>
              </div>
            `)}
          </div>
        `;
      }

      // Skip other complex objects for simplicity
      return null;
    }
    // Special handling for description field
    if (key === 'description') {
      return html`
        <div class="field-container">
          <label class="field-label">Description</label>
          <textarea 
            class="field-input textarea"
            value=${value || ''} 
            onChange=${(e) => handleFieldChange(key, e.target.value)}
            rows="5"
            placeholder="Enter product description"
          ></textarea>
          <div class="character-count ${value && value.length > 500 ? 'warning' : ''}">
            ${value ? value.length : 0} characters
            ${value && value.length > 500 ? ' (consider shortening)' : ''}
          </div>
        </div>
      `;
    }

    // Special handling for URL fields
    if (key === 'page' || key === 'learning_resource' || key === 'video_url' || key === 'image' || key === 'logo') {
      return html`
        <div class="field-container url-field-container">
          <label class="field-label">${key.replace(/_/g, ' ')}</label>
          <div class="url-input-group">
            <input 
              type="text" 
              value=${value || ''} 
              onChange=${(e) => {
    handleFieldChange(key, e.target.value);
    if (autoCheckUrls && e.target.value.trim()) {
      handleCheckUrl(e.target.value, key);
    }
  }}
              class="field-input"
              placeholder="https://example.com"
            />
            <button 
              type="button"
              class="check-url-button"
              onClick=${() => handleCheckUrl(value, key)}
              title="Check URL validity"
            >
              Check
            </button>
            <button 
              type="button"
              class="open-url-button"
              onClick=${() => handleOpenUrl(value)}
              title="Open URL in new tab"
              disabled=${!value}
            >
              Open
            </button>
          </div>
          
          ${urlStatus[key] && html`
            <div class=${`url-status-indicator ${urlStatus[key].status}`}>
              ${urlStatus[key].status === 'checking' ? 'Checking...'
    : urlStatus[key].status === 'valid' ? 'URL is valid' : 'URL is invalid or unreachable'}
              ${urlStatus[key].details?.redirected && html`
                <div class="redirect-info">
                  <span class="redirect-label">Redirects to:</span>
                  <span class="redirect-url">${urlStatus[key].details.finalUrl}</span>
                </div>
              `}
            </div>
          `}
        </div>
      `;
    }

    // Color picker for color fields
    if (key.includes('color')) {
      const isSpecialColor = key === 'primary_color' || key === 'secondary_color';
      const colorLabel = isSpecialColor ? `${key.replace(/_/g, ' ')} (used for ${key === 'primary_color' ? 'primary' : 'secondary'} buttons)` : key.replace(/_/g, ' ');

      return html`
        <div class="field-container">
          <label class="field-label">${colorLabel}</label>
          <div class="color-input-group">
            <input 
              type="color" 
              value=${value || '#ffffff'} 
              onChange=${(e) => handleFieldChange(key, e.target.value)}
              class="color-picker"
            />
            <input 
              type="text" 
              value=${value || ''} 
              onChange=${(e) => handleFieldChange(key, e.target.value)}
              class="field-input"
              placeholder="#000000"
            />
            ${isSpecialColor && html`
              <div class="color-preview" style=${`background-color: ${value || '#ffffff'}`}>
                <span>Sample</span>
              </div>
            `}
          </div>
        </div>
      `;
    }

    // Default field rendering
    return html`
      <div class="field-container">
        <label class="field-label">${key.replace(/_/g, ' ')}</label>
        <input 
          type="text" 
          value=${value || ''} 
          onChange=${(e) => handleFieldChange(key, e.target.value)}
          class="field-input"
        />
      </div>
    `;
  })}
        </form>
      </div>
    `;
  };

  const renderProductPreview = () => {
    if (!selectedProduct || !metadata[selectedProduct]) {
      return html`<div class="no-product-selected">No product selected</div>`;
    }

    const product = metadata[selectedProduct];

    return html`
      <div class="product-preview">
        <h2>Preview</h2>
        <div class="preview-scroll-container">
          <div class="product-card" style=${product.background_color ? `background-color: ${product.background_color}` : ''}>
            ${product.image || product.video_url ? html`
              <div class="product-media-header">
                ${product.video_url ? html`
                  <div class="video-container">
                    <video 
                      class="product-video" 
                      src=${product.video_url} 
                      controls
                      poster=${product.image || ''}
                      preload="metadata"
                    ></video>
                  </div>
                ` : product.image ? html`
                  <div class="image-container">
                    <img class="product-image" src=${product.image} alt="${product.title}" />
                  </div>
                ` : ''}
              </div>
            ` : ''}
            
            <div class="product-content-wrapper">
              <div class="product-header">
                ${product.logo ? html`<img class="product-logo" src=${product.logo} alt="${product.title} logo" />` : ''}
                <h3 class="product-title">${product.title || 'Product Title'}</h3>
              </div>
              
              <div class="product-content">
                <p class="product-description">${product.description || 'Product Description'}</p>
                
                ${product.details && product.details.length > 0 && html`
                  <div class="product-details">
                    <ul class="details-list">
                      ${product.details.map((detail) => html`
                        <li class="product-detail-item">${detail}</li>
                      `)}
                    </ul>
                  </div>
                `}
                
                <div class="product-links">
                  ${product.primary?.url && html`
                    <a 
                      href=${product.primary.url} 
                      target="_blank" 
                      class="product-link primary-link"
                      style=${product.primary_color ? `background-color: ${product.primary_color}` : ''}
                    >
                      ${product.primary.text || 'Start free trial'}
                    </a>
                  `}
                  
                  ${product.secondary?.url && html`
                    <a 
                      href=${product.secondary.url} 
                      target="_blank" 
                      class="product-link secondary-link"
                      style=${product.secondary_color ? `background-color: ${product.secondary_color}` : ''}
                    >
                      ${product.secondary.text || 'See plans & pricing'}
                    </a>
                  `}
                  
                  ${!product.primary?.url && !product.secondary?.url && product.page && html`
                    <a href=${product.page} target="_blank" class="product-link">Learn More</a>
                  `}
                </div>
                
                ${product.learning_resource && html`
                  <div class="learning-resource">
                    ${product.page && html`
                      <a href=${product.page} target="_blank" class="resource-link product-page-link">
                        <span class="resource-icon">🔗</span>
                        <span class="resource-text">Product Page</span>
                      </a>
                    `}
                    <a href=${product.learning_resource} target="_blank" class="resource-link">
                      <span class="resource-icon">📚</span>
                      <span class="resource-text">Learning Resources</span>
                    </a>
                  </div>
                `}
                
                ${product.targeted_segments && Object.keys(product.targeted_segments).length > 0 && html`
                  <div class="targeted-segments-preview">
                    <h4 class="segments-title">Targeted Segments</h4>
                    <div class="segments-container">
                      ${Object.entries(product.targeted_segments).map(([segmentKey, segmentValue]) => html`
                        <div class="segment-preview">
                          <h5 class="segment-title">${segmentKey}</h5>
                          ${segmentValue.plan && html`
                            <div class="segment-plan">
                              <p>${segmentValue.plan}</p>
                            </div>
                          `}
                          <div class="segment-links">
                            ${segmentValue.primary?.url && html`
                              <a 
                                href=${segmentValue.primary.url} 
                                target="_blank" 
                                class="product-link primary-link"
                                style=${product.primary_color ? `background-color: ${product.primary_color}` : ''}
                              >
                                ${segmentValue.primary.text || 'Start free trial'}
                              </a>
                            `}
                            ${segmentValue.secondary?.url && html`
                              <a 
                                href=${segmentValue.secondary.url} 
                                target="_blank" 
                                class="product-link secondary-link"
                                style=${product.secondary_color ? `background-color: ${product.secondary_color}` : ''}
                              >
                                ${segmentValue.secondary.text || 'See plans & pricing'}
                              </a>
                            `}
                          </div>
                        </div>
                      `)}
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>
          
          <div class="json-preview-container">
            <h3 class="json-preview-title">JSON Data</h3>
            <pre class="json-preview">${JSON.stringify(product, null, 2)}</pre>
          </div>
        </div>
      </div>
    `;
  };

  // Update the product actions section to include upload/paste buttons
  const renderProductActions = () => html`
      <div class="product-actions">
        <button class="action-button add-product" onClick=${handleAddProduct}>Add Product</button>
        <button class="action-button remove-product" onClick=${handleRemoveProduct} disabled=${!selectedProduct}>Remove Product</button>
        <button class="action-button export-json" onClick=${handleExportJSON}>Export JSON</button>
        <button class="action-button save-data" onClick=${handleSaveData}>Save Data</button>
        <button class="action-button show-template" onClick=${handleShowTemplate}>Show Template</button>
        <div class="json-import-actions">
          <label class="action-button upload-json">
            Upload JSON
            <input type="file" accept=".json" onChange=${handleFileUpload} style="display: none;" />
          </label>
          <button class="action-button paste-json" onClick=${handleJsonPaste}>Paste JSON</button>
        </div>
        <div class="save-status ${saveStatus.status}">
          ${saveStatus.message}
        </div>
      </div>
    `;

  if (loading) {
    return html`<div class="loading">Loading product data...</div>`;
  }

  return html`
    <div class="bc-container full-width">
      <div class="bc-content full-height">
        <h1>BC UAR Product Metadata</h1>
        
        <div class="product-selector-container">
          <label for="product-selector">Select Product:</label>
          <select 
            id="product-selector" 
            value=${selectedProduct}
            onChange=${handleProductChange}
            class="product-selector"
          >
            ${Object.keys(metadata).map((key) => html`
              <option value=${key}>${metadata[key].title || key}</option>
            `)}
          </select>
          
          ${renderProductActions()}
        </div>
        
        ${showTemplate && html`
          <div class="template-modal">
            <div class="template-modal-content">
              <div class="template-modal-header">
                <h2>Default Product Template</h2>
                <button class="close-button" onClick=${handleCloseTemplate}>×</button>
              </div>
              <div class="template-modal-body">
                <pre class="template-preview">${JSON.stringify(DEFAULT_PRODUCT_TEMPLATE, null, 2)}</pre>
              </div>
            </div>
          </div>
        `}
        
        <div class="view-toggle-container">
          <button 
            class=${`view-toggle-button ${viewMode === 'editor' ? 'active' : ''}`}
            onClick=${() => setViewMode('editor')}
          >
            Editor
          </button>
          <button 
            class=${`view-toggle-button ${viewMode === 'preview' ? 'active' : ''}`}
            onClick=${() => setViewMode('preview')}
          >
            Preview
          </button>
          <button 
            class=${`view-toggle-button ${viewMode === 'split' ? 'active' : ''}`}
            onClick=${() => setViewMode('split')}
          >
            Split View
          </button>
        </div>
        
        <div class=${`editor-container ${
    viewMode === 'editor' ? 'editor-only' : viewMode === 'preview' ? 'preview-only' : ''
  }`}>
          ${viewMode !== 'preview' && html`
            <div class="editor-section">
              ${renderProductEditor()}
            </div>
          `}
          ${viewMode !== 'editor' && html`
            <div class="preview-section">
              ${renderProductPreview()}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

export default async function init(el) {
  el.replaceChildren();
  render(html`<${App}/>`, el);
}

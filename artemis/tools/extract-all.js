// build/extract-all.js
const fs = require('fs');
const path = require('path');
const  extractHandlers  = require('./extract-utils');
const config = require('./components.config');

async function extractAllComponents() {
  const outputDir = './dist/hydration/';
  
  // Process each component
  await Promise.all(Object.entries(config).map(async ([name, cfg]) => {
    const outputPath = path.join(outputDir, `${name}-hydrate.js`);
    await extractHandlers(outputPath, cfg);
  }));

  // Generate unified loader
  const loaderCode = Object.keys(config).map(name => 
    `import './${name}-hydrate.js';`
  ).join('\n');
  
  fs.writeFileSync(path.join(outputDir, 'loader.js'), loaderCode);
}

// Run extraction
extractAllComponents();

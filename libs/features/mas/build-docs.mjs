// build-docs.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItContainer from 'markdown-it-container';
import markdownItHighlightjs from 'markdown-it-highlightjs';

// Reconstruct __dirname and __filename in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = process.argv[2];
if (!sourceFile) {
    console.error('Please provide a source file as an argument');
    process.exit(1);
}

const targetFile = process.argv[3];
if (!targetFile) {
    console.error('Please provide a target file as an argument');
    process.exit(1);
}

const skipMas = process.argv.includes('--skip-mas');

// Initialize markdown-it with desired plugins
const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
})
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: (slug, state) => ({
                href: `#${slug}`,
                title: 'Permalink to this heading',
            }),
        }),
    })
    .use(markdownItContainer, 'warning')
    .use(markdownItHighlightjs);

// Define input and output paths
const inputPath = path.join(__dirname, sourceFile);
const outputPath = path.join(targetFile);

// Read the Markdown file
const inputContent = fs.readFileSync(inputPath, 'utf8');

// Render Markdown to HTML
const htmlContent = md.render(inputContent);

const masJs = skipMas
    ? ''
    : '<script type="module" src="../../../deps/mas/mas.js"></script>';
    
    // HTML template with your custom element script
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>M@S Web Components</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="module" src="../../../deps/custom-elements.js"></script>
  
  <script>
    if (/localhost/.test(window.location.host)) {
      const meta = document.createElement('meta');
      meta.name = 'aem-base-url';
      meta.content = 'http://localhost:8080'; // local AEM proxy URL
      document.head.appendChild(meta);
      }
  </script>
  <!-- Include your custom element script as an ES6 module -->
  <script src="../../../features/spectrum-web-components/dist/theme.js" type="module"></script>
  <script src="../../../features/spectrum-web-components/dist/button.js" type="module"></script>
  ${masJs}
  <!-- Include Highlight.js stylesheet for syntax highlighting -->
  <link rel="stylesheet" href="../../../styles/styles.css">
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">
  <!-- Include any additional stylesheets -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
<main>
<sp-theme color="light" scale="medium">
${htmlContent}
</sp-theme>
</main>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
console.log('Documentation generated at', outputPath);

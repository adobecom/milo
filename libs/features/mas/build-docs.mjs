// build-docs.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
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

// Initialize markdown-it with desired plugins
const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
})
    .use(markdownItAttrs)
    .use(markdownItContainer, 'warning')
    .use(markdownItHighlightjs);

// Define input and output paths
const inputPath = path.join(__dirname, sourceFile);
const outputPath = path.join(targetFile);

// Read the Markdown file
const inputContent = fs.readFileSync(inputPath, 'utf8');

// Render Markdown to HTML
const htmlContent = md.render(inputContent);

// HTML template with your custom element script
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Custom Element Documentation</title>
  <!-- Include your custom element script as an ES6 module -->
  <script src="../../../features/spectrum-web-components/dist/theme.js" type="module"></script>
  <script src="../../../features/spectrum-web-components/dist/button.js" type="module"></script>
  <script type="module" src="../../../deps/mas/mas.js"></script>
  <!-- Include Highlight.js stylesheet for syntax highlighting -->
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

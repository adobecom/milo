import fs from "fs";
import puppeteer from "puppeteer";
import { performance } from "perf_hooks";
import { minify } from 'html-minifier';

const scriptContent = fs.readFileSync('./headless/inline.js', 'utf-8');
// const fns = fs.readFileSync('./dist/code.json', 'utf-8');

const run = async () => {
  const startTime = performance.now();
  const browser = await puppeteer.launch({ headless: "new", args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920,9000'
  ] , defaultViewport: {
    width: 1920,
    height: 9000
  } });
  const page = await browser.newPage();

  // Store CSS content mapped to URLs
  const cssMap = new Map();
  const cssPromises = [];

  // Block images, fonts, and tracking scripts to speed up loading
  await page.setRequestInterception(true);

  page.on("request", async (req) => {
    const resourceType = req.resourceType();
    const url = req.url();

    if (["image", "font", "media"].includes(resourceType)) {
        req.abort();
    } else if (resourceType === "stylesheet") {
        try {
            if(url.includes("caas.css")) {
              req.abort();
              return;
            }
            // console.log(`Processing CSS URL: ${url}`);
            // console.log(`Processing CSS URL: ${url}`);
            const promise = fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.text().then(css => {
                            // Minify CSS before storing
                            const minifiedCSS = css.replace(/\s+/g, ' ').trim();
                            cssMap.set(url, minifiedCSS);
                        });
                    }
                })
                .catch(error => {
                    console.error(`Failed to fetch CSS: ${url}`, error);
                });
              cssPromises.push(promise);
        } catch (error) {
            console.error(`Failed to fetch CSS: ${url}`, error);
        }
        req.continue();
    } else if (resourceType === "script" && url.includes("caas.js")) {
        console.log(`Blocking script: ${url}`);
        req.abort();
    } else {
        req.continue();
    }
  });

  const url = "https://main--cc--adobecom.aem.live/products/photoshop?milolibs=local&georouting=off";
  // const url = "https://main--dc--adobecom.hlx.live/acrobat/online/sign-pdf";
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  // Wait for all CSS promises to resolve
  await Promise.all(cssPromises);

  // Wait for a key element to be sure the page is ready
  await page.waitForSelector("#page-load-ok-milo");
//   Extract HTML
//   Inject inline styles
  // await page.evaluate((cssMap) => {
  //   const head = document.querySelector("head");
  //   for (const [url, cssContent] of Object.entries(cssMap)) {
  //     const styleTag = document.createElement("style");
  //     styleTag.textContent = cssContent;
  //     head.appendChild(styleTag); 

  //   }
  //   const meta = document.createElement("meta");
  //   meta.setAttribute('name', 'robots');
  //   meta.setAttribute('content', 'noindex,nofollow');
  //   head.appendChild(meta);
  // }, Object.fromEntries(cssMap));
  // const cssEntries = Object.entries(cssMap);
  // const midPoint = Math.ceil(cssEntries.length / 2);
  // const firstHalf = cssEntries.slice(0, midPoint);
  // const secondHalf = cssEntries.slice(midPoint);

  const hydrationTasks = await page.evaluate(() => window.__hydrate__);

  await page.evaluate(() => {
    const basePath = 'https://main--cc--adobecom.aem.live'; // change this to your desired base path
    document.querySelectorAll('a[href^="#"][data-modal-path]').forEach(anchor => {
      const modalPath = anchor.getAttribute('data-modal-path');
      if (!modalPath.startsWith(basePath)) {
        anchor.setAttribute('data-modal-path', basePath + modalPath);
      }
    });
  });


  let html = await page.evaluate(function(scriptContent, cssEntries, hydrationTasks) { 
    // const cssEntries = cssObject;
    const midPoint = Math.ceil(cssEntries.length / 2);
    const firstHalf = cssEntries.slice(0, midPoint);
  const secondHalf = cssEntries.slice(midPoint);
    return document.documentElement.outerHTML
    .replace('</head>', `<style>${firstHalf.map(([_, css]) => css).join('\n')}</style></head>`)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<script\b[^>]*\/>/gi, '')
    .replace(/<link\b[^>]*rel=["']preload["'][^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["'][^"']*preload[^"']*["'][^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*http-equiv=["']content-security-policy["'][^>]*>/gi, '')
    .replace(/<style>\s*body\s*{\s*display\s*:\s*none\s*;\s*}\s*<\/style>/gi, '')
    .replace(/<style>[^<]*body\s*{\s*display\s*:\s*none[^<]*<\/style>/gi, '')
    .replace('</body>',
        `<style>.consonant-Wrapper {height: unset !important;} ${secondHalf.map(([_, css]) => css).join('\n')}</style>
        <script >
        window.hydrateData = ${JSON.stringify(hydrationTasks)};
        </script>
        <script src="https://stage.adobeccstatic.com/unav/1.3/UniversalNav.js" type="text/javascript"></script>
        <script type="module">
          import "./libs/blocks/dist/loader.js";
        </script>\n</body>`)
}, scriptContent, [...cssMap.entries()], hydrationTasks);

const minifiedHtml = minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  useShortDoctype: true
});
 
  await browser.close();
  await fs.writeFileSync("output.html", minifiedHtml);
  await fs.writeFileSync("output.json", JSON.stringify(hydrationTasks));
  const endTime = performance.now();
  console.log(`⏳ Execution time: ${(endTime - startTime).toFixed(2)} ms`);
};

run().catch(console.error);

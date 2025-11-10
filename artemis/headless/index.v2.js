import { promises as fs } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { performance } from "perf_hooks";
import { minify } from 'html-minifier';
import * as lightningcss from 'lightningcss';

const OUTPUT_DIR = "generated_html";

// --- Helper Functions ---

const fetchAssetContent = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) return await response.text();
    console.error(`Failed to fetch asset: ${url} (Status: ${response.status})`);
  } catch (error) {
    console.error(`Error fetching asset: ${url}`, error.message);
  }
  return null;
};

const fetchAndMinifyCss = async (url) => {
  const cssContent = await fetchAssetContent(url);
  if (!cssContent) return null;

  try {
    // Use lightningcss to safely minify
    const { code } = lightningcss.transform({
      filename: url, // Provide a "filename" for better error messages
      code: Buffer.from(cssContent),
      minify: true,
      // You can also set browser targets here if needed
      // targets: { chrome: 98 << 16 }
    });
    return code.toString();
  } catch (error) {
    console.error(`Failed to minify CSS from ${url}:`, error.message);
    // Fallback to simple whitespace removal if minification fails
    return cssContent.replace(/\s+/g, ' ').trim();
  }
};


/**
 * Processes a single URL according to the new logic.
 * @param {puppeteer.Browser} browser - The main Puppeteer browser instance.
 * @param {object} urlConfig - An object containing url, filename, assets, and baseImageUrl.
 */
const processPage = async (browser, urlConfig) => {
  // Destructure all needed properties from the config
  const { url, filename, assets, baseImageUrl } = urlConfig;
  
  console.log(`Processing: ${url}`);
  const startTime = performance.now();
  
  let page; 

  try {
    // 1. Fetch the original page HTML as a string
    const originalHtml = await fetchAssetContent(url);
    if (!originalHtml) {
      throw new Error(`Could not fetch original HTML for ${url}`);
    }

    // 2. Use Puppeteer to get the prerendered snippet AND header classes
    page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "media"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: "networkidle0" });
    await page.waitForSelector("main > div");

    const prerenderedData = await page.evaluate(() => {
      const mainDiv = document.querySelector("main > div");
      const header = document.querySelector("header");
      
      const headerClasses = header ? Array.from(header.classList) : [];
      const targetClasses = headerClasses.filter(
        c => c === 'global-navigation' || c === 'has-breadcrumbs'
      );

      // Check for the div *immediately following* the header
      const hasFedsLocalNav = !!document.querySelector('header + div.feds-localnav');
      
      let snippet = null;
      if (mainDiv) {
        mainDiv.classList.add('prerender');
        snippet = mainDiv.outerHTML;
      }
      
      return { snippet, headerClasses: targetClasses, hasFedsLocalNav };
    });

    if (!prerenderedData.snippet) {
      throw new Error("Could not extract the prerendered snippet from main > div.");
    }

    // Ensure the base URL has a trailing slash to preserve the path
    let normalizedBaseUrl = baseImageUrl;
    if (normalizedBaseUrl && !normalizedBaseUrl.endsWith('/')) {
      normalizedBaseUrl += '/';
    }
    
    // 3. Perform HTML replacement, asset injection, and image processing
    let finalHtml = await page.evaluate(
      (baseHtml, snippet, headerClasses, hasFedsLocalNav, cssAssets, jsAssets, globalPreloadLinks, baseUrl) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(baseHtml, 'text/html');

        // Add nofollow, noindex
        const metaRobots = doc.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        metaRobots.setAttribute('content', 'noindex, nofollow');
        doc.head.appendChild(metaRobots);
        
        // Add header classes
        const headerEl = doc.querySelector('header');
        if (headerEl && headerClasses.length > 0) {
          headerEl.classList.add(...headerClasses);
        }

        if (hasFedsLocalNav && headerEl) {
          const fedsDiv = doc.createElement('div');
          fedsDiv.className = 'feds-localnav';
          // Insert the new empty div immediately after the header
          headerEl.insertAdjacentElement('afterend', fedsDiv);
        }
        
        // Replace the target div
        const mainEl = doc.querySelector("main");
        const targetDiv = mainEl ? mainEl.querySelector("div") : null;
        if (targetDiv) {
          targetDiv.outerHTML = snippet;
        }

        const isValidBaseUrl = baseUrl && (baseUrl.startsWith('http://') || baseUrl.startsWith('https://'));
        const injectedDiv = doc.querySelector('main > div.prerender');
        if (injectedDiv) {
          injectedDiv.querySelectorAll('video').forEach(videoEl => {
            videoEl.classList.add('video');

            // Check for poster image and add base URL if needed
            const oldPoster = videoEl.getAttribute('poster');
            if (isValidBaseUrl && oldPoster && !oldPoster.startsWith('http') && !oldPoster.startsWith('data:')) {
              try {
                const newPoster = new URL(oldPoster, baseUrl).href;
                videoEl.setAttribute('poster', newPoster);
              } catch (e) {
                console.warn('Skipping video poster rewrite due to error:', e.message, oldPoster);
              }
            }
          });
        }

        // --- Image Processing and Preload Generation ---
        const imagePreloadLinks = [];

        if (injectedDiv && isValidBaseUrl) {
          doc.querySelectorAll('picture').forEach(picture => {
            // Process <source> tags
            picture.querySelectorAll('source').forEach(source => {
              const oldSrcset = source.getAttribute('srcset');
              if (!oldSrcset) return;

              try {
                const newSrcset = oldSrcset.split(',').map(s => {
                  const parts = s.trim().split(' ');
                  const urlPart = parts[0];
                  if (urlPart.startsWith('http') || urlPart.startsWith('data:')) return s.trim();
                  const newUrl = new URL(urlPart, baseUrl).href;
                  return parts[1] ? `${newUrl} ${parts[1]}` : newUrl;
                }).join(', ');
                
                source.setAttribute('srcset', newSrcset);
                
                // Add <source> to preload list
                const preloadHref = newSrcset.split(',')[0].trim().split(' ')[0];
                imagePreloadLinks.push({
                  href: preloadHref,
                  as: 'image',
                  type: source.getAttribute('type'),
                  media: source.getAttribute('media')
                });
              } catch (e) { console.warn('Skipping srcset rewrite due to error:', e.message, oldSrcset); }
            });
            
            // Process <img> tag (rewrite src, but DO NOT preload)
            const img = picture.querySelector('img');
            if (img) {
              const oldSrc = img.getAttribute('src');
              if (oldSrc && !oldSrc.startsWith('http') && !oldSrc.startsWith('data:')) {
                try {
                  const newSrc = new URL(oldSrc, baseUrl).href;
                  img.setAttribute('src', newSrc);
                  // **FIX 1: Preloading for <img> tag REMOVED**
                  // imagePreloadLinks.push({ href: newSrc, as: 'image', type: null, media: null }); // <-- This line is now removed.
                } catch (e) { console.warn('Skipping src rewrite due to error:', e.message, oldSrc); }
              }
            }
          });
        }

        // --- Asset Injection ---

        // **FIX 2: Preload links injected BEFORE inline CSS**
        // const allPreloadLinks = [...globalPreloadLinks, ...imagePreloadLinks];
        const allPreloadLinks = [...imagePreloadLinks];
        allPreloadLinks.forEach(link => {
          if (!link.href) return;
          const linkTag = doc.createElement('link');
          linkTag.rel = 'preload';
          linkTag.href = link.href;
          linkTag.as = link.as;
          if (link.type) linkTag.type = link.type;
          if (link.media) linkTag.media = link.media;
          if (link.crossorigin) linkTag.crossOrigin = link.crossorigin;
          doc.head.appendChild(linkTag);
        });
        
        // Inject inline CSS (now runs *after* preloads)
        const inlineCssString = cssAssets.join('\n');
        if (inlineCssString) {
          const styleTag = doc.createElement('style');
          styleTag.textContent = inlineCssString;
          doc.head.appendChild(styleTag);
        }

        // Inject inline JS at the end of the body
        const inlineJsString = jsAssets.map(asset => {
          const scriptTag = doc.createElement('script');
          if (asset.type) scriptTag.type = asset.type;
          scriptTag.textContent = asset.content;
          return scriptTag.outerHTML;
        }).join('\n');
        doc.body.insertAdjacentHTML('beforeend', inlineJsString);

        return '<!DOCTYPE html>' + doc.documentElement.outerHTML;
      },
      originalHtml,
      prerenderedData.snippet,
      prerenderedData.headerClasses,
      prerenderedData.hasFedsLocalNav,
      assets.css,
      assets.js,
      assets.preloadLinks,
      normalizedBaseUrl // Pass the corrected base URL
    );

    const minifiedHtml = minify(finalHtml, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: false,
      minifyJS: true,
      useShortDoctype: true,
    });
    
    const htmlPath = path.join(OUTPUT_DIR, filename);
    await fs.writeFile(htmlPath, minifiedHtml);

    const endTime = performance.now();
    console.log(`✅ Finished ${filename} in ${(endTime - startTime).toFixed(2)} ms`);

  } catch (error) {
    console.error(`❌ Error processing ${url}:`, error.message);
  } finally {
    if (page) await page.close();
  }
};

/**
 * Main function to run the entire batch process
 */
const runBatch = async () => {
  let browser;
  try {
    console.log("Reading configuration files...");
    const urlsFileContent = await fs.readFile('urls.json', 'utf-8');
    const urlConfigs = JSON.parse(urlsFileContent);

    const assetConfigContent = await fs.readFile('asset-config.json', 'utf-8');
    const assetConfig = JSON.parse(assetConfigContent);

    console.log("Fetching global inline assets (this happens once)...");
    const globalCssPromises = (assetConfig.globalCssUrls || []).map(fetchAndMinifyCss);
    const globalJsPromises = (assetConfig.globalJsUrls || []).map(config => fetchAssetContent(config.url));
    
    const globalCssAssets = (await Promise.all(globalCssPromises)).filter(Boolean);
    const globalJsContents = await Promise.all(globalJsPromises);
    
    const globalJsAssets = globalJsContents.map((content, index) => ({
      content: content,
      type: assetConfig.globalJsUrls[index].type
    })).filter(asset => asset.content);
    
    console.log(`Fetched ${globalCssAssets.length} global CSS and ${globalJsAssets.length} global JS assets.`);

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log("🚀 Launching browser...");
    browser = await puppeteer.launch({ headless: "new", 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,9000'], 
      defaultViewport: {
        width: 1440, // <-- And change width here
        height: 9000
      }});

    for (const config of urlConfigs) {
      // --- Merge global and page-specific assets ---
      const pageCssUrls = config.assets?.cssUrls || [];
      const pagePreloadLinks = config.assets?.preloadLinks || [];

      // Fetch any page-specific CSS
      const pageCssPromises = pageCssUrls.map(fetchAndMinifyCss);
      const pageCssAssets = (await Promise.all(pageCssPromises)).filter(Boolean);

      // Combine assets for the current page
      const finalAssets = {
        css: [...globalCssAssets, ...pageCssAssets],
        js: globalJsAssets, // Assuming JS is always global for now
        preloadLinks: [...(assetConfig.globalPreloadLinks || []), ...pagePreloadLinks],
      };
      
      const enrichedConfig = { ...config, assets: finalAssets };
      await processPage(browser, enrichedConfig);
    }

  } catch (error) {
    console.error("Fatal error during batch execution:", error);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed. Batch complete.");
    }
  }
};

runBatch().catch(console.error);

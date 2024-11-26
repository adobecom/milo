/**
 * Initial crawl code from https://github.com/da-sites/nexter/blob/main/nx/public/utils/tree.js
 * Modified to cater Graybox use-case where the crawl is done at the experience folder level
 * across all regions.
 * Eg: /org/repo/exp1, /org/repo/<locale>/exp1 etc.
*/

import RequestHandler from './request-handler.js';

class CrawlTree {
  constructor(callback, accessToken, maxConcurrent = 500, crawlType = 'default', expName = '', isDraftsOnly = false) {
    this.queue = [];
    this.activeCount = 0;
    this.maxConcurrent = maxConcurrent;
    this.callback = callback;
    this.accessToken = accessToken;
    this.crawlType = crawlType;
    this.expName = expName;
    this.isDraftsOnly = isDraftsOnly;
    this.requestHandler = new RequestHandler(this.accessToken);
    // eslint-disable-next-line no-useless-escape
    this.grayboxPathPattern = new RegExp(`^\/[^\/]+\/[^\/]+\/(?:[^\/]+\/)?${expName}(?:\/|$)`);
    if (this.isDraftsOnly && this.crawlType === 'graybox') {
      // eslint-disable-next-line no-useless-escape
      this.grayboxPathPattern = new RegExp(`^\/[^\/]+\/[^\/]+\/(?:[^\/]+\/)?${expName}\/drafts(?:\/|$)`);
    }

    this.push = this.push.bind(this);
    this.processQueue = this.processQueue.bind(this);
    this.processItem = this.processItem.bind(this);
  }

  async push(data) {
    this.queue.push(data);
    await this.processQueue();
  }

  async processQueue() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      await this.processItem(item);
    }
  }

  async processItem(item) {
    this.activeCount += 1;
    try {
      await this.callback(item);
    } finally {
      this.activeCount -= 1;
      await this.processQueue();
    }
  }

  async getChildren(path) {
    const files = [];
    const folders = [];

    const resp = await this.requestHandler.daFetch(`https://admin.da.live/list${path}`);
    if (resp.ok) {
      const json = await resp.json();
      json.forEach((child) => {
        if (!child.ext) {
          folders.push(child.path);
        } else {
          // Filter out files based on crawlType, grayboxPathPattern and isDraftsOnly flag
          // eslint-disable-next-line no-lonely-if
          if ((this.crawlType !== 'graybox' && this.crawlType !== 'floodgate')
            || (this.crawlType === 'graybox' && this.grayboxPathPattern.test(child.path))
            || (this.crawlType === 'floodgate' && (!this.isDraftsOnly || child.path.includes('/drafts/')))
          ) {
            files.push(child);
          }
        }
      });
    }
    return { files, folders };
  }
}

function calculateCrawlTime(startTime) {
  const crawlTime = Date.now() - startTime;
  return String(crawlTime / 1000).substring(0, 4);
}

/**
 * Crawl a path and run a callback on each file found.
 *
 * @param {Object} options - The crawl options.
 * @param {string} options.path - The parent path to crawl.
 * @param {function} options.callback - The callback to run when a file is found.
 * @param {number} options.concurrent - The amount of concurrent requests for the callback queue.
 * @param {number} options.throttle - How much to throttle the crawl.
 * @param {string} options.crawlType - The type of crawl ('graybox' or other).
 */
function crawl({
  path, callback, concurrent, throttle = 100, accessToken, crawlType = 'default', isDraftsOnly = false,
}) {
  let expName = '';
  let sitePath = path;
  if (crawlType === 'graybox') {
    const [, org, repo, exp] = path.split('/');
    sitePath = `/${org}/${repo}`;
    expName = exp;
  }

  let time;
  let isCanceled = false;
  const files = [];
  const folders = [sitePath];
  const inProgress = [];
  const startTime = Date.now();
  const queue = new CrawlTree(callback, accessToken, concurrent, crawlType, expName, isDraftsOnly);

  const results = new Promise((resolve) => {
    const interval = setInterval(async () => {
      if (folders.length > 0) {
        inProgress.push(true);
        const currentPath = folders.pop();
        const children = await queue.getChildren(currentPath);
        files.push(...children.files);
        folders.push(...children.folders);
        if (callback && children.files.length > 0) {
          await Promise.all(children.files.map((file) => queue.push(file)));
        }
        inProgress.pop();
      }
      if ((inProgress.length === 0 && folders.length === 0) || isCanceled) {
        time = calculateCrawlTime(startTime);
        clearInterval(interval);
        resolve(files);
      }
    }, throttle);
  });

  const getDuration = () => {
    if (time) return time;
    return calculateCrawlTime(startTime);
  };

  const cancelCrawl = () => {
    isCanceled = true;
  };
  return { results, getDuration, cancelCrawl };
}

export default crawl;

import { expect } from '@esm-bundle/chai';
import searchAndReplace from '../../../tools/floodbox/search-replace.js';

describe('searchAndReplace', () => {
  it('should replace floodgate URLs correctly', () => {
    const content = 'https://main--repo-fg-pink--org.aem.page/folder/page1';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'org',
      repo: 'repo-fg-pink',
      expName: 'expName',
      color: 'pink',
    });
    expect(result).to.equal('https://main--repo--org.aem.page/folder/page1');
  });

  it('should add the color suffix to preview domains (direction toFloodgate)', () => {
    const content = 'https://main--repo--org.aem.page/folder/page1';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'org',
      repo: 'repo',
      expName: 'expName',
      color: 'pink',
      direction: 'toFloodgate',
    });
    expect(result).to.equal('https://main--repo-fg-pink--org.aem.page/folder/page1');
  });

  it('should derive both repos whether given the source or floodgate repo', () => {
    const content = 'https://main--repo-fg-pink--org.aem.page/page';
    const fromFloodgateRepo = searchAndReplace({
      content, searchType: 'floodgate', org: 'org', repo: 'repo-fg-pink', color: 'pink', direction: 'toSource',
    });
    const fromSourceRepo = searchAndReplace({
      content, searchType: 'floodgate', org: 'org', repo: 'repo', color: 'pink', direction: 'toSource',
    });
    expect(fromFloodgateRepo).to.equal('https://main--repo--org.aem.page/page');
    expect(fromSourceRepo).to.equal(fromFloodgateRepo);
  });

  it('should add the color suffix to da app links (direction toFloodgate)', () => {
    const content = '<p><a href="https://da.live/app/adobecom/da-events/tools/da-apps/schedule-maker?schedule=xxxxxxx">Schedule: Creativity Award Block – Monday, Aug 17, 2026, 12:33 PM</a></p>';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-pink',
      expName: 'expName',
      color: 'pink',
      direction: 'toFloodgate',
    });
    expect(result).to.equal('<p><a href="https://da.live/app/adobecom/da-events-fg-pink/tools/da-apps/schedule-maker?schedule=xxxxxxx">Schedule: Creativity Award Block – Monday, Aug 17, 2026, 12:33 PM</a></p>');
  });

  it('should strip the color suffix from da app links back to the source repo (direction toSource)', () => {
    const content = '<p><a href="https://da.live/app/adobecom/da-events-fg-pink/tools/da-apps/schedule-maker?schedule=xxxxxxx">Schedule</a></p>';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-pink',
      expName: 'expName',
      color: 'pink',
      direction: 'toSource',
    });
    expect(result).to.equal('<p><a href="https://da.live/app/adobecom/da-events/tools/da-apps/schedule-maker?schedule=xxxxxxx">Schedule</a></p>');
  });

  it('should default to toSource when no direction is provided', () => {
    const content = '<a href="https://da.live/app/adobecom/da-events-fg-pink/page">Link</a>';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-pink',
      expName: 'expName',
      color: 'pink',
    });
    expect(result).to.equal('<a href="https://da.live/app/adobecom/da-events/page">Link</a>');
  });

  it('should normalize mixed da app links toFloodgate (idempotent add)', () => {
    const content = [
      '<a href="https://da.live/app/adobecom/da-events/page-a">A</a>',
      '<a href="https://da.live/app/adobecom/da-events-fg-pink/page-b">B</a>',
    ].join('');
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-pink',
      expName: 'expName',
      color: 'pink',
      direction: 'toFloodgate',
    });
    expect(result).to.equal([
      '<a href="https://da.live/app/adobecom/da-events-fg-pink/page-a">A</a>',
      '<a href="https://da.live/app/adobecom/da-events-fg-pink/page-b">B</a>',
    ].join(''));
  });

  it('should normalize mixed da app links toSource (idempotent strip)', () => {
    const content = [
      '<a href="https://da.live/app/adobecom/da-events/page-a">A</a>',
      '<a href="https://da.live/app/adobecom/da-events-fg-pink/page-b">B</a>',
    ].join('');
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-pink',
      expName: 'expName',
      color: 'pink',
      direction: 'toSource',
    });
    expect(result).to.equal([
      '<a href="https://da.live/app/adobecom/da-events/page-a">A</a>',
      '<a href="https://da.live/app/adobecom/da-events/page-b">B</a>',
    ].join(''));
  });

  it('should be idempotent when run twice in the same direction', () => {
    const content = '<a href="https://da.live/app/adobecom/da-events/page">Link</a>';
    const args = {
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-blue',
      expName: 'expName',
      color: 'blue',
      direction: 'toFloodgate',
    };
    const once = searchAndReplace({ ...args, content });
    const twice = searchAndReplace({ ...args, content: once });
    expect(once).to.equal('<a href="https://da.live/app/adobecom/da-events-fg-blue/page">Link</a>');
    expect(twice).to.equal(once);
  });

  it('should use the provided color when adding the suffix', () => {
    const content = '<a href="https://da.live/app/adobecom/da-events/page">Link</a>';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-blue',
      expName: 'expName',
      color: 'blue',
      direction: 'toFloodgate',
    });
    expect(result).to.equal('<a href="https://da.live/app/adobecom/da-events-fg-blue/page">Link</a>');
  });

  it('should only rewrite da app links for the org and repo being processed', () => {
    const content = [
      '<a href="https://da.live/app/adobecom/da-events/page">same repo</a>',
      '<a href="https://da.live/app/adobecom/other-repo/page">other repo</a>',
      '<a href="https://da.live/app/other-org/da-events/page">other org</a>',
      '<a href="https://da.live/app/adobecom/da-events-legacy/page">repo name prefix</a>',
    ].join('');
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-pink',
      expName: 'expName',
      color: 'pink',
      direction: 'toFloodgate',
    });
    expect(result).to.equal([
      '<a href="https://da.live/app/adobecom/da-events-fg-pink/page">same repo</a>',
      '<a href="https://da.live/app/adobecom/other-repo/page">other repo</a>',
      '<a href="https://da.live/app/other-org/da-events/page">other org</a>',
      '<a href="https://da.live/app/adobecom/da-events-legacy/page">repo name prefix</a>',
    ].join(''));
  });

  it('should adjust both preview domains and da app links together', () => {
    const content = [
      '<a href="https://main--da-events-fg-pink--adobecom.aem.page/folder/page1">Preview</a>',
      '<a href="https://da.live/app/adobecom/da-events-fg-pink/tools/da-apps/schedule-maker">Edit</a>',
    ].join('');
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'adobecom',
      repo: 'da-events-fg-pink',
      expName: 'expName',
      color: 'pink',
      direction: 'toSource',
    });
    expect(result).to.equal([
      '<a href="https://main--da-events--adobecom.aem.page/folder/page1">Preview</a>',
      '<a href="https://da.live/app/adobecom/da-events/tools/da-apps/schedule-maker">Edit</a>',
    ].join(''));
  });

  it('should not swallow markup when the repo is the last path segment of a da app link', () => {
    const content = '<a href="https://da.live/app/adobecom/da-events">Repo root</a>';
    const toFloodgate = searchAndReplace({
      content, searchType: 'floodgate', org: 'adobecom', repo: 'da-events-fg-pink', color: 'pink', direction: 'toFloodgate',
    });
    const backToSource = searchAndReplace({
      content: toFloodgate, searchType: 'floodgate', org: 'adobecom', repo: 'da-events-fg-pink', color: 'pink', direction: 'toSource',
    });
    expect(toFloodgate).to.equal('<a href="https://da.live/app/adobecom/da-events-fg-pink">Repo root</a>');
    expect(backToSource).to.equal(content);
  });

  it('should leave content without da app links or matching domains unchanged', () => {
    const content = '<p><a href="https://example.com/adobecom/da-events/page">External</a></p>';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'org',
      repo: 'repo-fg-pink',
      expName: 'expName',
      color: 'pink',
      direction: 'toFloodgate',
    });
    expect(result).to.equal(content);
  });

  it('should replace graybox URLs and remove graybox styles and blocks', () => {
    const content = `
      <div class="gb-style">Content</div>
      <div class="graybox">Graybox Block</div>
      <a href="https://main--repo-graybox--org.aem.page/expName/page">Link</a>
    `;
    const result = searchAndReplace({
      content,
      searchType: 'graybox',
      org: 'org',
      repo: 'repo-graybox',
      expName: 'expName',
    });
    expect(result).to.not.include('gb-style');
    expect(result).to.not.include('class="graybox"');
    expect(result).to.include('https://main--repo-graybox--org.aem.page/page');
  });

  it('should handle unknown search type gracefully', () => {
    const content = 'https://main--repo--org.aem.page/expName/page';
    const result = searchAndReplace({
      content,
      searchType: 'unknown',
      org: 'org',
      repo: 'repo',
      expName: 'expName',
    });
    expect(result).to.equal(content);
  });

  it('should handle empty content', () => {
    const content = '';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'org',
      repo: 'repo-fg-pink',
      expName: 'expName',
      color: 'pink',
    });
    expect(result).to.equal('');
  });

  it('should handle content without matching URLs', () => {
    const content = 'https://main--lalaland--org.aem.page/folder/page1';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'org',
      repo: 'repo-fg-pink',
      expName: 'expName',
      color: 'pink',
    });
    expect(result).to.equal(content);
  });
});

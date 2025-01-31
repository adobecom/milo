import { expect } from '@esm-bundle/chai';
import searchAndReplace from '../../../tools/floodbox/search-replace.js';

describe('searchAndReplace', () => {
  it('should replace floodgate URLs correctly', () => {
    const content = 'https://main--repo-pink--org.aem.page/folder/page1';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'org',
      repo: 'repo-pink',
      expName: 'expName',
    });
    expect(result).to.equal('https://main--repo--org.aem.page/folder/page1');
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
      repo: 'repo-pink',
      expName: 'expName',
    });
    expect(result).to.equal('');
  });

  it('should handle content without matching URLs', () => {
    const content = 'https://main--lalaland--org.aem.page/folder/page1';
    const result = searchAndReplace({
      content,
      searchType: 'floodgate',
      org: 'org',
      repo: 'repo-pink',
      expName: 'expName',
    });
    expect(result).to.equal(content);
  });
});

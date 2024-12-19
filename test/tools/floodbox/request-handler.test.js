import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import RequestHandler from '../../../tools/floodbox/request-handler.js';

describe('RequestHandler', () => {
  let requestHandler;
  let fetchStub;
  const accessToken = 'testToken';

  beforeEach(() => {
    requestHandler = new RequestHandler(accessToken);
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it('should return 401 status for unauthorized access', async () => {
    fetchStub.resolves(new Response(null, { status: 401 }));
    const response = await requestHandler.daFetch('https://main--da-hello--sukamat.aem.page/file1');
    expect(response).to.equal(401);
  });

  it('should return response for authorized access', async () => {
    fetchStub.resolves(new Response(null, { status: 200 }));
    const response = await requestHandler.daFetch('https://main--da-hello--sukamat.aem.page/file1');
    expect(response.status).to.equal(200);
  });

  it('should fail to upload content with error status', async () => {
    fetchStub.onFirstCall().resolves(new Response(null, { status: 500 }));
    const response = await requestHandler.uploadContent('/path/to/file', 'content', 'html');
    expect(response.statusCode).to.equal(500);
  });

  it('should upload content for editable file successfully', async () => {
    fetchStub.onFirstCall().resolves(new Response(null, { status: 200 }));
    fetchStub.onSecondCall().resolves(new Response(null, { status: 200 }));
    const response = await requestHandler.uploadContent('/path/to/file', 'content', 'html');
    expect(response.statusCode).to.equal(200);
  });

  it('should fail to upload content for non-editable file', async () => {
    fetchStub.resolves(new Response(null, { status: 200 }));
    const response = await requestHandler.uploadContent('/path/to/file', 'content', 'pdf');
    expect(response.statusCode).to.equal(200);
  });

  it('should upload content for non-editable file successfully', async () => {
    fetchStub.resolves(new Response(null, { status: 500 }));
    const response = await requestHandler.uploadContent('/path/to/file', 'content', 'pdf');
    expect(response.statusCode).to.equal(500);
  });

  it('should delete content successfully', async () => {
    fetchStub.resolves(new Response(null, { status: 204 }));
    const response = await requestHandler.deleteContent('/path/to/file');
    expect(response.statusCode).to.equal(204);
    expect(response.filePath).to.equal('/path/to/file');
  });

  it('should fail to delete content with error status', async () => {
    fetchStub.resolves(new Response(null, { status: 500 }));
    const response = await requestHandler.deleteContent('/path/to/file');
    expect(response.statusCode).to.equal(500);
    expect(response.filePath).to.equal('/path/to/file');
    expect(response.errorMsg).to.equal('Failed to delete file');
  });
});

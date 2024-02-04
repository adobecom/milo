import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getEventTimeFg, copyToFloodgateTree, deleteFgTree, promoteFiles } from '../../../../libs/blocks/floodgateui/utils/miloc.js';
import { enableActionButton, heading, loadDetailsCheck, renderModal, deleteStatusCheck, shouldOpenModalOnMount, allActionStatus, copyStatusCheck } from '../../../../libs/blocks/floodgateui/utils/state.js';
import { mockFetch } from '../../../helpers/generalHelpers.js';
import { mockPayload } from './mockdata.js';

const payload = mockPayload;

describe('View', () => {

  it('should save the end time in heading state', async () => {
    heading.value.fgColor = 'pink';
    const mockResponseData = {
      fgreleasetimeslots: {
        data: [
          {
            release: 'pink',
            endTime: new Date(),
          },
        ],
      },
    };
    window.fetch = sinon.stub().returns(Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    }));
    getEventTimeFg();
    expect(heading.value.endTime).to.be.an.instanceof(Date);
  });

  it('action updates the status', async () => {
    allActionStatus.value = {
      ...allActionStatus.value,
      copyStatus: true,
    };
    window.fetch = await mockFetch(payload);
    loadDetailsCheck.value = true;
    renderModal.value = true;
    shouldOpenModalOnMount.value = true;
    heading.value = {
      ...heading.value,
      editUrl: 'Heading Sample',
    };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
      env: 'stage'
    };
    window.fetch = await mockFetch({ payload });
    enableActionButton.value = true;
    copyToFloodgateTree();
    expect(copyStatusCheck.value).to.equal('IN PROGRESS');
  });

  it('action updates the status', async () => {
    window.fetch = await mockFetch({ payload });
    loadDetailsCheck.value = true;
    renderModal.value = true;
    shouldOpenModalOnMount.value = true;
    heading.value = {
      ...heading.value,
      editUrl: 'Heading Sample',
    };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
    };
    window.fetch = await mockFetch({ payload });
    enableActionButton.value = true;
    promoteFiles(true);
    copyToFloodgateTree();
    deleteFgTree();
    expect(copyStatusCheck.value).to.equal('IN PROGRESS');
  });
});

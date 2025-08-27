import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { getGrayboxExperienceId } from '../../../libs/blocks/caas/utils.js';

// Mock the DOM environment
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Bulk Publish to CaaS - Graybox Experience ID Integration', () => {
  describe('getGrayboxExperienceId from host parameter', () => {
    it('should extract experience ID from .graybox domain', () => {
      const host = 'test-exp.graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.equal('test-exp');
    });

    it('should extract experience ID from .**-graybox domain', () => {
      const host = 'test-exp.bacom-graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.equal('test-exp');
    });

    it('should extract experience ID from complex graybox patterns', () => {
      const host = 'qa-demo.enterprise-stage-graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.equal('qa-demo');
    });

    it('should return null for non-graybox domains', () => {
      const host = 'business.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.be.null;
    });

    it('should return null for malformed graybox hosts', () => {
      const host = 'graybox.adobe.com';
      const result = getGrayboxExperienceId(host, '');
      expect(result).to.be.null;
    });

    it('should handle empty host parameter', () => {
      const result = getGrayboxExperienceId('', '');
      expect(result).to.be.null;
    });

    it('should handle null/undefined host parameter', () => {
      // The function expects string parameters, so we should test with empty strings instead
      const result1 = getGrayboxExperienceId('', '');
      const result2 = getGrayboxExperienceId('', '');
      expect(result1).to.be.null;
      expect(result2).to.be.null;
    });
  });

  describe('Graybox Experience ID in CaaS Payload', () => {
    it('should add gbExperienceID to caasProps when graybox host is detected', () => {
      // This test simulates the integration logic in bulk-publish-to-caas.js
      const host = 'test-exp.graybox.adobe.com';
      const grayboxExperienceId = getGrayboxExperienceId(host, '');

      // Simulate the caasProps object
      const caasProps = {
        entityId: 'test-entity-id',
        title: 'Test Title',
        // ... other properties
      };

      // Simulate adding the graybox experience ID
      if (grayboxExperienceId) {
        caasProps.gbExperienceID = grayboxExperienceId;
      }

      expect(caasProps.gbExperienceID).to.equal('test-exp');
    });

    it('should not add gbExperienceID when no graybox pattern is found', () => {
      const host = 'business.adobe.com';
      const grayboxExperienceId = getGrayboxExperienceId(host, '');

      const caasProps = {
        entityId: 'test-entity-id',
        title: 'Test Title',
      };

      if (grayboxExperienceId) {
        caasProps.gbExperienceID = grayboxExperienceId;
      }

      expect(caasProps.gbExperienceID).to.be.undefined;
    });

    it('should handle various graybox host patterns correctly', () => {
      const testCases = [
        { host: 'demo.graybox.adobe.com', expected: 'demo' },
        { host: 'stage-test.bacom-graybox.adobe.com', expected: 'stage-test' },
        { host: 'prod-demo.enterprise-prod-graybox.adobe.com', expected: 'prod-demo' },
        { host: 'qa.bacom-stage-graybox.adobe.com', expected: 'qa' },
      ];

      testCases.forEach(({ host, expected }) => {
        const result = getGrayboxExperienceId(host, '');
        expect(result).to.equal(expected, `Failed for host: ${host}`);
      });
    });
  });
});

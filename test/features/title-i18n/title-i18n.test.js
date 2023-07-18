import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import {
  decorateTitle,
  getRegionDisplayName,
} from '../../../libs/features/title-i18n/title-i18n.js';

describe('Title i18n', () => {
  describe('addTitleRegionSuffix', () => {
    beforeEach(async () => {
      document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    });

    it('getRegionDisplayNames for different locales', () => {
      [
        { locale: null, rdn: null },
        { locale: { ietf: null }, rdn: null },
        { locale: { ietf: 'fr-BE' }, rdn: 'Belgique' },
        { locale: { ietf: 'en-US' }, rdn: 'United States' },
        { locale: { lang: 'fr', reg: 'BE' }, rdn: 'Belgique' },
        { locale: { lang: 'en', reg: 'US' }, rdn: 'United States' },
        { locale: { lang: 'en', reg: '002', rdn: 'Africa' }, rdn: 'Africa' },
        { locale: { lang: 'es', reg: '419' }, rdn: 'Latinoamérica' },
        { locale: { ietf: 'es' }, rdn: null },
        { locale: { lang: 'es', reg: 'ES' }, rdn: 'España' },
      ].forEach((t) => expect(getRegionDisplayName(t.locale)).to.equal(t.rdn));
    });

    it('decorateTitle off', () => {
      const cfg = {
        addTitleRegionSuffix: 'off',
        locale: { ietf: 'fr-BE' },
      };
      decorateTitle(cfg);
      expect(document.title).to.equal('Document Title');
    });

    it('decorateTitle on and locale invalid (noop)', () => {
      const cfg = {
        addTitleRegionSuffix: 'on',
        locale: null,
      };
      decorateTitle(cfg);
      expect(document.title).to.equal('Document Title');
    });

    it('decorateTitle on in US (noop)', () => {
      const cfg = {
        addTitleRegionSuffix: 'on',
        locale: { ietf: 'en-US' },
      };
      decorateTitle(cfg);
      expect(document.title).to.equal('Document Title');
    });

    it('decorateTitle on', () => {
      const cfg = {
        addTitleRegionSuffix: 'on',
        locale: { lang: 'fr', reg: 'BE' },
      };
      decorateTitle(cfg);
      expect(document.title).to.equal('Document Title (Belgique)');
    });

    it('decorateTitle on overridng ietf', () => {
      const cfg = {
        addTitleRegionSuffix: 'on',
        locale: { ietf: 'fr-BE', lang: 'en', reg: 'BE' },
      };
      decorateTitle(cfg);
      expect(document.title).to.equal('Document Title (Belgium)');
    });
  });
});

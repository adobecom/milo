// @ts-ignore
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { expect, use } from '@esm-bundle/chai';
import sinon from 'sinon';

import { equalsCaseInsensitive } from '../src/external.js';

use(chaiAsPromised);

use((chai) => {
    function normalise(val) {
        return String(val)
            .trim()
            .replace(/>\s*</g, '><')
            .replace(/>\s*/g, '>')
            .replace(/\s*</g, '<')
            .replace(/"\s*>/g, '">')
            .replace(/"\s*\/>/g, '/>')
            .replace(/\s+/g, ' ');
    }

    chai.Assertion.addMethod('html', function assertHtml(snapshot) {
        const normAct = normalise(this._obj);
        const normExp = normalise(snapshot);
        this.assert(
            equalsCaseInsensitive(normAct, normExp),
            'expected to match html snapshot',
            'expected not to match html snapshot',
            normAct,
            normExp,
        );
    });
});

export { expect, sinon };

import * as mod from '../../../../libs/utils/globe/quote-particles.js';
import quoteParticlesSuite from '../globe-gallery/quote-particles.suite.js';

mod.configureGlobe({ name: 'firefly-globe', vars: 'fg', easePow: 3 });
quoteParticlesSuite({ block: 'firefly-globe', pre: 'fg', mod });

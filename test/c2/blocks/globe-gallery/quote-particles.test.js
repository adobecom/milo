import * as mod from '../../../../libs/utils/globe/quote-particles.js';
import quoteParticlesSuite from './quote-particles.suite.js';

mod.configureGlobe({ easePow: 2 });
quoteParticlesSuite({ block: 'globe-gallery', mod });

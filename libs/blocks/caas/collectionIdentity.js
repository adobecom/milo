import { getMetadata } from '../../utils/utils.js';
import {
  EXTENSIONLESS_SECTIONS_META,
  findUnrecognizedSections,
  isIdentityPolicyMiss,
  toIdentityUrl,
} from '../../utils/caasIdentity.js';

// CONSUMER-SIDE source of the extensionless-section list.
//
// The list is a fact about one SITE: which of its repos publish without the
// `.html` extension. It is therefore configured per site, never hardcoded,
// and reaches each runtime through the same channel as the forced-`.html`
// flag it qualifies -- the auto-publish rule config and the bulk publisher's
// preset or advanced panel on the publishing side, this page metadata on the
// rendering side.
//
// Both sides must be given the SAME value. A site that sets `blog` where it
// publishes but not here would mint bare ids and then look up `.html` ones,
// and every card in the section would stop resolving with no error. That is
// the same coupling the `caas-identity-html` flag already has, and it is
// documented for authors alongside it.
//
// This file exists so that libs/utils/caasIdentity.js -- which is bundled into
// the publisher and the poller, where no page metadata exists -- stays a pure
// function of its arguments.
// The metadata name is shared with the sidekick publisher rather than written
// out again: a typo resolves to '', which is the deliberately-silent "no
// exceptions" case, so a drifted literal would orphan a whole section quietly.
// Latched, because this resolver runs once per card reference and a collection
// can hold dozens.
let badSectionsLogged = false;

const extensionlessSections = () => {
  const authored = getMetadata(EXTENSIONLESS_SECTIONS_META);
  // The other three channels all report an entry that cannot name a segment,
  // each with the logger it already has. Without the same check here the
  // consumer would be the one place a misauthored value is unobservable: the
  // flag is ON, so warnOnIdentityPolicyMiss cannot fire (it is gated on the
  // flag being off), and the publisher page that would have warned is a
  // DIFFERENT page from this collection. The author sees nothing at all while
  // every card in the section fails to resolve.
  //
  // Reported at `error` rather than `warning` because the consequence differs
  // from the publishing side: there a bad entry mints a duplicate id, here it
  // drops cards out of a live collection.
  const bad = findUnrecognizedSections(authored);
  if (bad.length && !badSectionsLogged) {
    badSectionsLogged = true;
    window.lana?.log(
      `CaaS: unrecognized ${EXTENSIONLESS_SECTIONS_META} entries '${bad.join(', ')}'. `
      + 'These name a path, host or glob rather than a bare path segment, so they match '
      + 'nothing and the section keeps forced-`.html` ids.',
      { tags: 'caas,htmlIdentity', severity: 'error', sampleRate: 100 },
    );
  }
  return authored;
};

// Test-only: the latch above is module-level by design, which otherwise makes
// the "reports once, then stays quiet" behaviour untestable from a known state.
export const resetCollectionIdentityNoticesForTesting = () => {
  badSectionsLogged = false;
};

/**
 * The string a COLLECTION CONSUMER hashes to look a card up by url.
 *
 * Takes the page flag rather than a pre-resolved boolean so there is no way to
 * apply the flag while skipping the section list that qualifies it.
 *
 * @param {string} url authored link, schemed or scheme-less
 * @param {string|boolean} pageEnabled authored page-level flag value
 * @returns {string} the string to hash
 */
export const toCollectionIdentityUrl = (url, pageEnabled = false) => (
  toIdentityUrl(url, pageEnabled, extensionlessSections())
);

/**
 * The consumer's identity-miss check.
 *
 * Supplies the configured sections so a link in an extensionless section --
 * authored without the extension by design -- is not reported as a miss.
 *
 * @param {string} url authored link, schemed or scheme-less
 * @param {string|boolean} pageEnabled authored page-level flag value
 * @returns {boolean}
 */
export const isCollectionIdentityPolicyMiss = (url, pageEnabled = false) => (
  isIdentityPolicyMiss(url, pageEnabled, extensionlessSections())
);

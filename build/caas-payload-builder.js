// Entry point for the self-contained CaaS payload-builder bundle.
//
// Built via `npm run build:caas-payload-builder` into a single UMD file that is
// committed and served from milo.adobe.com. The milo-caas scheduled service
// fetches that bundle, verifies its checksum, and runs it via `vm` so the CaaS
// card -> XDM business logic has a single source of truth here in Milo.
//
// Browser callers should keep importing from ./tools/send-to-caas/send-utils.js
// directly; this entry exists only to produce the standalone artifact.
//
// It imports straight from the self-contained leaf (caas-payload-core.js) rather
// than send-utils.js, so the bundle never pulls in the browser-only POST/admin
// code (which would transitively drag Milo's utils.js into the artifact).

import {
  buildCaasXdmPayload,
  getCaasIds,
  hasCardMetadata,
  hasContentTypeTag,
  isDisabledOnPage,
} from '../tools/send-to-caas/caas-payload-core.js';

export {
  buildCaasXdmPayload,
  getCaasIds,
  hasCardMetadata,
  hasContentTypeTag,
  isDisabledOnPage,
};

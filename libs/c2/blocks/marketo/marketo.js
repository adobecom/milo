/*
 * STOPGAP for the forge-c2-blog-next integration branch only, not for merge.
 * Recast passes the C1 marketo block through on da-bacom-blog pages, and on a
 * foundation:c2 page milo refuses C1-only blocks. This re-exports the C1 init
 * (the libs/c2/blocks/iframe precedent) with C2-token styles until the content
 * decision on removing Marketo from the blog template is made.
 */
import init from '../../../blocks/marketo/marketo.js';

export default init;

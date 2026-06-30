// ── ReimagineVariants — the Stardust directions strip (result surface) ────────
// Reimagine explores several directions from one URL. This shows them as a row of
// thumbnails: click one to make it the active preview; each opens its real hosted
// prototype page, can be shared, or opened in Figma (HTML → Figma). Demo-only data
// (session.reimagineVariants), but the pages it opens are real living HTML.

import { useState } from 'react';
import OpenIn from '@react-spectrum/s2/icons/OpenIn';
import Copy from '@react-spectrum/s2/icons/Copy';
import Checkmark from '@react-spectrum/s2/icons/Checkmark';
import { StardustMark } from './StardustMark';

export interface ReimagineVariant {
  id: string;
  label: string;
  note: string;
  thumb: string;
  href: string;
}

interface Props {
  variants: ReimagineVariant[];
  // When provided (the pre-send gate), each card gets a "Send to Authoring" action
  // so it's clear you're sending THAT direction. `sendingId` is the id mid-send.
  // There is no "select" state — each card owns its own buttons.
  onSend?: (v: ReimagineVariant) => void;
  sendingId?: string | null;
  // When set (post-send), only this direction stays vivid; the rest grey out so
  // it's obvious which one went to Authoring.
  lockedId?: string | null;
}

// "Open in Figma" via the html.to.design import flow. We don't have a server-side
// HTML→Figma bridge in the demo, so this opens the html.to.design importer (the
// real plugin path leadership asked to see); the hosted page URL is what you paste.
function figmaImportHref(pageHref: string): string {
  return `https://html.to.design/?url=${encodeURIComponent(pageHref)}`;
}

export function ReimagineVariants({ variants, onSend, sendingId, lockedId }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function share(v: ReimagineVariant) {
    try {
      await navigator.clipboard.writeText(v.href);
      setCopiedId(v.id);
      setTimeout(() => setCopiedId((c) => (c === v.id ? null : c)), 1600);
    } catch {
      /* clipboard blocked — the page is still openable */
    }
  }

  return (
    <div className="pf-rv">
      <div className="pf-rv-head">
        <span className="pf-rv-mark"><StardustMark /></span>
        {lockedId
          ? <>Sent the chosen direction to Authoring. The others stay here if you want them.</>
          : <>Stardust explored <b>{variants.length}</b> directions.{onSend ? ' Pick one, then send it.' : ' Open any one.'}</>}
      </div>
      <div className="pf-rv-grid">
        {variants.map((v) => {
          const dimmed = Boolean(lockedId) && v.id !== lockedId;
          const locked = v.id === lockedId;
          return (
            <div key={v.id} className={`pf-rv-card${dimmed ? ' pf-rv-card--dim' : ''}${locked ? ' pf-rv-card--locked' : ''}`}>
              {/* Header ON THE CARD (off the image): label left, quiet icon
                  buttons right — Open, Share, Figma. */}
              <div className="pf-rv-bar">
                <span className="pf-rv-label">{locked ? 'Sent' : v.label}</span>
                <span className="pf-rv-icons">
                  <button type="button" className="pf-rv-icon" aria-label="Open" title="Open" onClick={() => window.open(v.href, '_blank', 'noopener')}>
                    <OpenIn UNSAFE_className="pf-rv-ic" />
                  </button>
                  <button type="button" className="pf-rv-icon" aria-label={copiedId === v.id ? 'Copied' : 'Share'} title="Share" onClick={() => share(v)}>
                    {copiedId === v.id ? <Checkmark UNSAFE_className="pf-rv-ic" /> : <Copy UNSAFE_className="pf-rv-ic" />}
                  </button>
                  <button type="button" className="pf-rv-icon" aria-label="Open in Figma" title="Open in Figma" onClick={() => window.open(figmaImportHref(v.href), '_blank', 'noopener')}>
                    <FigmaGlyph />
                  </button>
                </span>
              </div>

              {/* Clean screenshot — nothing overlaid. */}
              <div className="pf-rv-shot-wrap">
                <img className="pf-rv-shot" src={v.thumb} alt={`${v.label} direction`} loading="lazy" />
              </div>

              {/* One calm Send button. */}
              {onSend && (
                <button
                  type="button"
                  className="pf-rv-send"
                  onClick={() => onSend(v)}
                  disabled={sendingId === v.id}
                >
                  {sendingId === v.id ? 'Sending…' : 'Send to Authoring'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Small Figma mark for the "Open in Figma" action.
function FigmaGlyph() {
  return (
    <svg className="pf-rv-ic" viewBox="0 0 38 57" aria-hidden="true">
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

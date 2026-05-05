/* eslint-disable no-underscore-dangle, import/no-unresolved */
import { html, nothing } from 'https://da.live/deps/lit/dist/index.js';
import * as floodbox from '../floodbox.js';

/** Strip admin preview URL prefix for display only. */
export function stripAdminPreviewPrefixForDisplay(href) {
  if (!href || typeof href !== 'string') return href || '';
  let s = href.replace(/^https:\/\/admin\.(hlx|aem)\.page\/preview(\/|\s+|$)/i, '');
  if (s && !s.startsWith('/') && !s.startsWith('http')) {
    s = `/${s}`;
  }
  return s;
}

// eslint-disable-next-line class-methods-use-this
export function aemUrlToPageUrl(aemUrl) {
  try {
    const url = new URL(aemUrl);
    // Expected admin URL shape: /{action}/{org}/{repo}/{branch}/{...path}
    // parts === ['', action, org, repo, branch, ...rest] → length ≥ 5
    const parts = url.pathname.split('/');
    if (parts.length < 5) return aemUrl;
    const [, action, org, repo] = parts;
    if (!action || !org || !repo) return aemUrl;
    const pagePath = parts.length > 5 ? `/${parts.slice(5).join('/')}` : '';
    const domain = action === 'live' ? 'aem.live' : 'aem.page';
    return `https://main--${repo}--${org}.${domain}${pagePath}`;
  } catch {
    return aemUrl;
  }
}

export function renderRemainingBadge(cmp, count) {
  const isActive = count > 0 && !cmp._cancelled;
  return html`
    <div class="detail-card detail-card-remaining">
      <div>
        <h3>Remaining</h3>
        <p>${count}</p>
      </div>
      <div class="detail-card-actions">
        ${isActive ? html`<button class="cancel-button" @click=${() => cmp.handleCancel()}>Cancel</button>` : nothing}
        ${cmp._cancelled ? html`<span class="cancelled-label">Cancelled</span>` : nothing}
      </div>
    </div>`;
}

export function renderLinksSection(cmp, urls, action) {
  if (urls.length === 0) return nothing;
  return html`
    <details class="links-section">
      <summary>${urls.length} ${action} link${urls.length !== 1 ? 's' : ''}</summary>
      <ul class="links-list">
        ${urls.map((aemUrl) => html`<li><a href="${aemUrlToPageUrl(aemUrl)}" target="_blank" rel="noopener">${aemUrlToPageUrl(aemUrl)}</a></li>`)}
      </ul>
    </details>
  `;
}

export function renderStartAction(cmp) {
  const disabled = cmp._filesToProcess.length === 0;
  if (cmp._selectedOption === 'fgCopy') {
    return html`<button class="find-action-btn accent" type="button"
      .disabled=${disabled}
      @click=${(e) => cmp.handleCopy(e)}>Start Copy</button>`;
  }
  if (cmp._selectedOption === 'fgPromote') {
    return html`<button class="find-action-btn accent" type="button"
      .disabled=${disabled}
      @click=${(e) => cmp.handlePromote(e)}>Start Promote</button>`;
  }
  return html`<button class="find-action-btn accent delete-action"
    type="button" .disabled=${disabled}
    @click=${(e) => cmp.handleDeleteClick(e)}>Start Delete</button>`;
}

export function renderFindStep(cmp) {
  const fragmentCount = cmp._fragmentsAssets.size;

  return html`
    <div class="tab-step active" data-id="find">
      <div class="find-header">
        <h3 class="find-header-title">Files to Process</h3>
        ${cmp._actionReady ? html`
          <div class="find-header-actions">
            <button class="find-action-btn find-action-btn-outline" type="button"
              @click=${() => cmp.handleBack()}>Edit Paths</button>
            ${renderStartAction(cmp)}
          </div>
        ` : nothing}
      </div>
      ${cmp._finding ? html`
        <p>Finding files and references...
          ${cmp._findingStatus ? html`<br><span class="finding-status">${cmp._findingStatus}</span>` : nothing}
        </p>
      ` : nothing}
      ${cmp._notFoundPaths.length > 0 ? html`
        <div class="not-found-section">
          <h4>Paths Not Found (${cmp._notFoundPaths.length})</h4>
          <ul class="not-found-list">
            ${cmp._notFoundPaths.map((p) => html`
              <li><span class="path">${p.href}</span> <span class="not-found-badge">${p.status}</span></li>
            `)}
          </ul>
        </div>
      ` : nothing}
      ${cmp._actionReady ? html`
        <p>Review the file list below. Remove any files you don't want to process.</p>
        <div class="detail-cards find-cards">
          ${floodbox.renderBadge('Pages', cmp._filesToProcess.length - fragmentCount)}
          ${cmp._selectedOption !== 'fgDelete' ? floodbox.renderBadge('Fragments & Assets', fragmentCount) : nothing}
          ${floodbox.renderBadge('Total', cmp._filesToProcess.length)}
        </div>
        ${cmp._selectedOption === 'fgPromote' ? html`
          <div class="ignore-section">
            <label class="ignore-toggle">
              <input type="checkbox" .checked=${cmp._promoteIgnore}
                @change=${(e) => cmp.togglePromoteIgnore(e)}>
              <span>Add paths to ignore from promote</span>
            </label>
            ${cmp._promoteIgnore ? html`
              <textarea name="promote-ignore-paths" rows="3"
                placeholder="Enter paths to ignore from promote, one per line."></textarea>
            ` : nothing}
          </div>
        ` : nothing}
        <ul class="url-checklist">
          ${cmp._filesToProcess.map((path) => html`
            <li>
              <div class="path">${path}</div>
              <button class="icon-button" type="button" @click=${() => cmp.removeFile(path)}>
                <svg class="icon"><use href="#spectrum-close"/></svg>
              </button>
            </li>
          `)}
        </ul>
      ` : nothing}
    </div>
  `;
}

export function renderCopyStep(cmp) {
  const colorCap = cmp._selectedColor.charAt(0).toUpperCase() + cmp._selectedColor.slice(1);
  const total = cmp._copiedFilesCount + cmp._copiedErrorList.length;
  const remaining = cmp._filesToProcess.length - total;
  return html`
    <div class="tab-step" data-id="copy">
      <h3>Copy Content to ${colorCap} Site</h3>
      <p>Copying files to "/${cmp._org}/${cmp._floodgateRepo}"...</p>
      <div class="detail-cards">
        ${renderRemainingBadge(cmp, remaining)}
        ${floodbox.renderBadge('Copy Errors', cmp._copiedErrorList.length, true)}
        ${floodbox.renderBadge('Success', cmp._copiedFilesCount)}
        ${floodbox.renderBadge('Total', cmp._copiedFilesCount + cmp._copiedErrorList.length)}
      </div>
      <div class="detail-lists">
        ${floodbox.renderList('Copy Errors', cmp._copiedErrorList)}
      </div>
      ${cmp._copyDuration > 0 ? html`<p>Duration: ${cmp._copyDuration} seconds</p>` : nothing}
    </div>
  `;
}

export function renderPromoteStep(cmp) {
  const done = cmp._promotedFilesCount + cmp._promoteErrorList.length;
  const remaining = cmp._filesToProcess.length - done;
  return html`
    <div class="tab-step" data-id="promote">
      <h3>Promote Floodgated Content</h3>
      <p>Promoting files from "/${cmp._org}/${cmp._floodgateRepo}" to "/${cmp._org}/${cmp._sourceRepo}"...</p>
      <div class="detail-cards promote-cards">
        ${renderRemainingBadge(cmp, remaining)}
        ${floodbox.renderBadge('Promote Ignored', cmp._promoteIgnoreList.length, true)}
        ${floodbox.renderBadge('Promote Errors', cmp._promoteErrorList.length, true)}
        ${floodbox.renderBadge('Success', cmp._promotedFilesCount)}
        ${floodbox.renderBadge('Total', cmp._promotedFilesCount + cmp._promoteErrorList.length + cmp._promoteIgnoreList.length)}
      </div>
      <div class="detail-lists">
        ${floodbox.renderList('Promote Ignored', cmp._promoteIgnoreList)}
        ${floodbox.renderList('Promote Errors', cmp._promoteErrorList)}
      </div>
      ${cmp._promoteDuration > 0 ? html`<p>Duration: ${cmp._promoteDuration} seconds</p>` : nothing}
    </div>
  `;
}

export function previewErrorsForDisplay(cmp) {
  return cmp._previewErrorList.map((e) => ({
    href: stripAdminPreviewPrefixForDisplay(e.href),
    status: e.status,
  }));
}

export function renderPreviewStep(cmp) {
  const totalExpected = cmp._selectedOption === 'fgCopy'
    ? cmp._copiedFilesCount
    : cmp._promotedFilesCount;

  return html`
    <div class="tab-step" data-id="preview">
      <h3>Preview Files</h3>
      <p>Previewing files...</p>
      <div class="detail-cards">
        ${renderRemainingBadge(cmp, totalExpected - cmp._previewedFilesCount)}
        ${floodbox.renderBadge('Preview Errors', cmp._previewErrorList.length, true)}
        ${floodbox.renderBadge('Success', cmp._previewedFilesCount)}
        ${floodbox.renderBadge('Total', cmp._previewedFilesCount + cmp._previewErrorList.length)}
      </div>
      <div class="detail-lists">
        ${floodbox.renderList('Preview Errors', previewErrorsForDisplay(cmp))}
      </div>
      ${renderLinksSection(cmp, cmp._previewedUrls, 'preview')}
      ${cmp._previewDuration > 0 ? html`<p>Duration: ${cmp._previewDuration} seconds</p>` : nothing}
    </div>
  `;
}

export function renderPublishStep(cmp) {
  return html`
    <div class="tab-step" data-id="publish">
      <h3>Publish Files</h3>
      <p>Publishing files...</p>
      <div class="detail-cards">
        ${renderRemainingBadge(cmp, cmp._promotedFilesCount - cmp._publishedFilesCount)}
        ${floodbox.renderBadge('Publish Errors', cmp._publishErrorList.length, true)}
        ${floodbox.renderBadge('Success', cmp._publishedFilesCount)}
        ${floodbox.renderBadge('Total', cmp._publishedFilesCount + cmp._publishErrorList.length)}
      </div>
      <div class="detail-lists">
        ${floodbox.renderList('Publish Errors', cmp._publishErrorList)}
      </div>
      ${renderLinksSection(cmp, cmp._publishedUrls, 'publish')}
      ${cmp._publishDuration > 0 ? html`<p>Duration: ${cmp._publishDuration} seconds</p>` : nothing}
    </div>
  `;
}

export function renderUnpublishStep(cmp) {
  const colorCap = cmp._selectedColor.charAt(0).toUpperCase() + cmp._selectedColor.slice(1);
  const done = cmp._unpublishFilesCount + cmp._unpublishErrorList.length;
  const remaining = cmp._filesToProcess.length - done;
  return html`
    <div class="tab-step" data-id="unpublish">
      <h3>Unpublish ${colorCap} Site Content</h3>
      <p>Unpublishing content from "/${cmp._org}/${cmp._floodgateRepo}"...</p>
      <div class="detail-cards">
        ${renderRemainingBadge(cmp, remaining)}
        ${floodbox.renderBadge('Unpublish Errors', cmp._unpublishErrorList.length, true)}
        ${floodbox.renderBadge('Success', cmp._unpublishFilesCount)}
        ${floodbox.renderBadge('Total', cmp._unpublishFilesCount + cmp._unpublishErrorList.length)}
      </div>
      <div class="detail-lists">
        ${floodbox.renderList('Unpublish Errors', cmp._unpublishErrorList)}
      </div>
      ${cmp._unpublishDuration > 0 ? html`<p>Duration: ${cmp._unpublishDuration} seconds</p>` : nothing}
    </div>
  `;
}

export function renderDeleteStep(cmp) {
  const colorCap = cmp._selectedColor.charAt(0).toUpperCase() + cmp._selectedColor.slice(1);
  const done = cmp._deletedFilesCount + cmp._deleteErrorList.length;
  const remaining = cmp._filesToProcess.length - done;
  return html`
    <div class="tab-step" data-id="delete">
      <h3>Delete ${colorCap} Site Content</h3>
      <p>Deleting content from "/${cmp._org}/${cmp._floodgateRepo}"...</p>
      <div class="detail-cards">
        ${renderRemainingBadge(cmp, remaining)}
        ${floodbox.renderBadge('Delete Errors', cmp._deleteErrorList.length, true)}
        ${floodbox.renderBadge('Success', cmp._deletedFilesCount)}
        ${floodbox.renderBadge('Total', cmp._deletedFilesCount + cmp._deleteErrorList.length)}
      </div>
      <div class="detail-lists">
        ${floodbox.renderList('Delete Errors', cmp._deleteErrorList)}
      </div>
      ${cmp._deleteDuration > 0 ? html`<p>Duration: ${cmp._deleteDuration} seconds</p>` : nothing}
    </div>
  `;
}

export function getDoneSteps(cmp) {
  const steps = [];
  const allErrors = [];
  if (cmp._selectedOption === 'fgCopy') {
    steps.push({
      name: 'Copy',
      success: cmp._copiedFilesCount,
      errors: cmp._copiedErrorList.length,
      duration: cmp._copyDuration,
    });
    allErrors.push(...cmp._copiedErrorList);
    if (cmp._previewAfterCopy && cmp._previewDuration > 0) {
      steps.push({
        name: 'Preview',
        success: cmp._previewedFilesCount,
        errors: cmp._previewErrorList.length,
        duration: cmp._previewDuration,
      });
      allErrors.push(...cmp._previewErrorList);
    }
  } else if (cmp._selectedOption === 'fgPromote') {
    steps.push({
      name: 'Promote',
      success: cmp._promotedFilesCount,
      errors: cmp._promoteErrorList.length,
      duration: cmp._promoteDuration,
    });
    allErrors.push(...cmp._promoteErrorList);
    if (cmp._previewDuration > 0) {
      steps.push({
        name: 'Preview',
        success: cmp._previewedFilesCount,
        errors: cmp._previewErrorList.length,
        duration: cmp._previewDuration,
      });
      allErrors.push(...cmp._previewErrorList);
    }
    if (cmp._publishAfterPromote && cmp._publishDuration > 0) {
      steps.push({
        name: 'Publish',
        success: cmp._publishedFilesCount,
        errors: cmp._publishErrorList.length,
        duration: cmp._publishDuration,
      });
      allErrors.push(...cmp._publishErrorList);
    }
  } else {
    if (cmp._unpublishDuration > 0) {
      steps.push({
        name: 'Unpublish',
        success: cmp._unpublishFilesCount,
        errors: cmp._unpublishErrorList.length,
        duration: cmp._unpublishDuration,
      });
      allErrors.push(...cmp._unpublishErrorList);
    }
    if (cmp._deleteDuration > 0) {
      steps.push({
        name: 'Delete',
        success: cmp._deletedFilesCount,
        errors: cmp._deleteErrorList.length,
        duration: cmp._deleteDuration,
      });
      allErrors.push(...cmp._deleteErrorList);
    }
  }
  return { steps, allErrors };
}

export function renderDoneStepCard(cmp, s) {
  const isCopyWithErrors = s.name === 'Copy' && s.errors > 0;
  const isPreviewWithErrors = s.name === 'Preview' && s.errors > 0;
  if (isCopyWithErrors) {
    return html`
      <details class="done-step-expandable">
        <summary class="detail-card detail-card-errors">
          <div>
            <h3>${s.name}</h3>
            <p>${s.success}<span class="done-card-sub">/${s.success + s.errors}</span></p>
          </div>
          <div class="done-card-meta">
            <span class="done-card-err">${s.errors} err</span>
          </div>
          <span class="done-expand-chevron" aria-hidden="true"></span>
        </summary>
        <div class="done-step-expand-body">
          ${floodbox.renderList('Copy Errors', cmp._copiedErrorList)}
        </div>
      </details>
    `;
  }
  if (isPreviewWithErrors) {
    return html`
      <details class="done-step-expandable">
        <summary class="detail-card detail-card-preview-errors">
          <div>
            <h3>${s.name}</h3>
            <p>${s.success}<span class="done-card-sub">/${s.success + s.errors}</span></p>
          </div>
          <div class="done-card-meta">
            <span class="done-card-err">${s.errors} err</span>
          </div>
          <span class="done-expand-chevron" aria-hidden="true"></span>
        </summary>
        <div class="done-step-expand-body">
          ${floodbox.renderList('Preview Errors', previewErrorsForDisplay(cmp))}
        </div>
      </details>
    `;
  }
  return html`
    <div class="detail-card ${s.errors > 0 ? 'detail-card-errors' : ''}">
      <div>
        <h3>${s.name}</h3>
        <p>${s.success}<span class="done-card-sub">/${s.success + s.errors}</span></p>
      </div>
      <div class="done-card-meta">
        ${s.errors > 0 ? html`<span class="done-card-err">${s.errors} err</span>` : nothing}
        <span class="done-card-time">${s.duration}s</span>
      </div>
    </div>
  `;
}

export function renderDone(cmp) {
  const { steps, allErrors } = getDoneSteps(cmp);
  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const totalSuccess = steps.reduce((sum, s) => sum + s.success, 0);
  const totalErrors = allErrors.length;
  const bannerClass = cmp._cancelled ? 'done-banner-warn' : 'done-banner-ok';

  return html`
    <div class="tab-step" data-id="done">
      <div class="done-banner ${bannerClass}">
        <h3>${cmp._cancelled ? 'Operation Cancelled' : 'Operation Complete'}</h3>
        <p>
          ${totalSuccess} file${totalSuccess !== 1 ? 's' : ''} processed
          ${totalErrors > 0 ? html` &mdash; <strong>${totalErrors} error${totalErrors !== 1 ? 's' : ''}</strong>` : nothing}
          in ${totalDuration}s
        </p>
      </div>
      <div class="detail-cards done-cards">
        ${steps.map((s) => renderDoneStepCard(cmp, s))}
      </div>
      ${renderLinksSection(cmp, cmp._previewedUrls, 'preview')}
      ${renderLinksSection(cmp, cmp._publishedUrls, 'publish')}
      <div class="done-actions">
        ${totalErrors > 0 ? html`
          <button class="accent" type="button"
            @click=${() => cmp.retryErrors()}>
            Retry ${totalErrors} Error${totalErrors !== 1 ? 's' : ''}
          </button>
        ` : nothing}
        <button class="accent"
          @click=${() => cmp.resetApp()}>Start Over</button>
      </div>
    </div>
  `;
}

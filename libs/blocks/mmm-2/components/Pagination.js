import { html } from '../../../deps/htm-preact.js';

const PER_PAGE_OPTIONS = [25, 50, 100];

const ARROW_ICONS = {
  first: html`<svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.205 10.59L8.61504 6L13.205 1.41L11.795 0L5.79504 6L11.795 12L13.205 10.59ZM0.795044 0H2.79504V12H0.795044V0Z" fill="currentColor"/></svg>`,
  prev: html`<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.70504 1.41L6.29504 0L0.295044 6L6.29504 12L7.70504 10.59L3.12504 6L7.70504 1.41Z" fill="currentColor"/></svg>`,
  next: html`<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.70504 0L0.295044 1.41L4.87504 6L0.295044 10.59L1.70504 12L7.70504 6L1.70504 0Z" fill="currentColor"/></svg>`,
  last: html`<svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.795044 1.41L5.38504 6L0.795044 10.59L2.20504 12L8.20504 6L2.20504 0L0.795044 1.41ZM11.205 0H13.205V12H11.205V0Z" fill="currentColor"/></svg>`,
};

function Pagination({
  pageNum, perPage, totalRecords, loading, onPageChange, onPerPageChange,
  id = 'mmm2-pagination-dropdown',
}) {
  if (loading) return null;

  if (!totalRecords) {
    return html`<div class="mmm2-pagination"><h5 class="mmm2-pagination-no-results">No results</h5></div>`;
  }

  const totalPages = Math.ceil(totalRecords / perPage);
  const prev = pageNum - 1 || 1;
  const next = pageNum < totalPages ? pageNum + 1 : pageNum;
  const rangeStart = pageNum * perPage - (perPage - 1);
  const rangeEnd = pageNum * perPage < totalRecords ? pageNum * perPage : totalRecords;

  return html`
    <div class="mmm2-pagination" data-current-page=${pageNum} data-perpage=${perPage}>
      <div class="mmm2-pagination-wrapper">
        <div class="mmm2-pagination-select">
          <label for=${id}>Items per page:</label>
          <select
            id=${id}
            class="mmm2-pagination-dropdown"
            value=${perPage}
            onChange=${(e) => onPerPageChange(Number(e.target.value))}
          >
            ${PER_PAGE_OPTIONS.map((option) => html`<option value=${option}>${option}</option>`)}
          </select>
        </div>
        <div class="mmm2-pagination-arrows">
          <a class="mmm2-arrow ${pageNum === 1 ? 'is-disabled' : ''}" onClick=${() => onPageChange(1)}>${ARROW_ICONS.first}</a>
          <a class="mmm2-arrow ${pageNum === 1 ? 'is-disabled' : ''}" onClick=${() => onPageChange(prev)}>${ARROW_ICONS.prev}</a>
          <div class="mmm2-pagination-summary">
            <span>${rangeStart.toLocaleString()} - ${rangeEnd.toLocaleString()} of ${totalRecords.toLocaleString()}</span>
          </div>
          <a class="mmm2-arrow ${pageNum === totalPages ? 'is-disabled' : ''}" onClick=${() => onPageChange(next)}>${ARROW_ICONS.next}</a>
          <a class="mmm2-arrow ${pageNum === totalPages ? 'is-disabled' : ''}" onClick=${() => onPageChange(totalPages)}>${ARROW_ICONS.last}</a>
        </div>
      </div>
    </div>
  `;
}

export default Pagination;

import { html, useState } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';

export default function Urls() {
  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Extract the items to display on the current page
  const itemsToDisplay = urls.value.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(urls.value.length / itemsPerPage);

  // Function to handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return html`
    <div class="locui-section">
      <div class="locui-section-heading">
        <h2 class="locui-section-label">URLs</h2>
      </div>
      <ul class="locui-urls">
        ${itemsToDisplay.map((url, idx) => {
          // Adjust idx based on the current page
          const adjustedIdx = (currentPage - 1) * itemsPerPage + idx;

          return html`
            <${Url} item=${url} key=${adjustedIdx} idx=${adjustedIdx} suffix=${['source', 'floodgated content']} />
          `;
        })}
      </ul>
      <div class="pagination">
        <button class="prev-page" onclick=${() => handlePageChange(currentPage - 1)} disabled=${currentPage === 1}>Previous</button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => html`
          <button
            class="page-button ${currentPage === page ? 'current-page' : ''}"
            onclick=${() => handlePageChange(page)}
          >
            ${page}
          </button>
        `)}
        <button class="next-page" onclick=${() => handlePageChange(currentPage + 1)} disabled=${currentPage === totalPages}>Next</button>
      </div>
    </div>
  `;
}

import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';

function Urls() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [message, setMessage] = useState('');

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      showMessage(`Navigated to page ${newPage}`);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Set current page to 1 when performing a search

    const filtered = urls.value.filter((url) => url.pathname.includes(searchTerm));
    setFilteredUrls(filtered);
    showMessage(`Filtered URLs for: ${searchTerm}`);
  };

  const handleClearSearch = () => {
    setFilteredUrls([]);
    setSearchTerm('');
    showMessage('Exited filtered view');
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleKeyPressEvent = (event) => handleInputKeyPress(event);
    window.addEventListener('keydown', handleKeyPressEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyPressEvent);
    };
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToDisplay = searchTerm ? filteredUrls.slice(startIndex, endIndex) : urls.value.slice(startIndex, endIndex);

  const totalPages = Math.ceil((searchTerm ? filteredUrls.length : urls.value.length) / itemsPerPage);

  const displayPages = () => {
    const visiblePages = 10; // Number of page buttons to display

    if (totalPages <= visiblePages) {
      // Display all pages if there are not many
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Display ten pages at a time with ellipsis (...) in between
      const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
      const endPage = Math.min(totalPages, startPage + visiblePages - 1);

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  };

  return html`
    <div class="fgui-section">
      <div class="search-message-container">
        <div class="search-box-pagination-container">
          <div class="search-box-container">
            <div class="search-box">
              <div class="spectrum-search-field">
                <input
                  type="text"
                  placeholder="Path"
                  value=${searchTerm}
                  oninput=${handleSearchChange}
                  onkeypress=${handleInputKeyPress}
                />
                ${searchTerm && html`<span class="clear-icon" onclick=${handleClearSearch}>×</span>`}
              </div>
            </div>
          </div>
          <div class="pagination">
            <button class="prev-page" onclick=${() => handlePageChange(currentPage - 1)} disabled=${currentPage === 1}>Previous</button>
            ${displayPages().map((page) => html`
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
        <div class=${`message ${message ? 'message-show' : ''}`}>${message}</div>
      </div>

      <ul class="fgui-urls">
        ${itemsToDisplay.map((url, idx) => {
          const adjustedIdx = (currentPage - 1) * itemsPerPage + idx;

          return html`
            <${Url} item=${url} key=${adjustedIdx} id=${`url-${adjustedIdx}`} suffix=${['source', 'floodgated content']} />
          `;
        })}
      </ul>
    </div>
    <div class="pagination-bottom">
      <button class="prev-page" onclick=${() => handlePageChange(currentPage - 1)} disabled=${currentPage === 1}>Previous</button>
      ${displayPages().map((page) => html`
        <button
          class="page-button ${currentPage === page ? 'current-page' : ''}"
          onclick=${() => handlePageChange(page)}
        >
          ${page}
        </button>
      `)}
      <button class="next-page" onclick=${() => handlePageChange(currentPage + 1)} disabled=${currentPage === totalPages}>Next</button>
    </div>
  `;
}

export default Urls;


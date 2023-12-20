import { html, useState, useEffect, useRef } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';

function Urls() {
  const itemsPerPage = 100;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [message, setMessage] = useState('');
  const searchInputRef = useRef(null);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      showMessage(`Navigated to page ${newPage}`);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleSearch = (term) => {
    setCurrentPage(1);

    const filtered = urls.value.filter((url) => url.pathname.includes(term));
    setFilteredUrls(filtered);
    if (filtered.length === 0) {
      showMessage('No results found');
    } else {
      showMessage(`Filtered URLs for: ${term}`);
    }
  };

  const handleClearSearch = () => {
    setFilteredUrls([]);
    setSearchTerm('');
    showMessage('Exited filtered view');
    searchInputRef.current.focus(); // Set focus back to the search input
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    handlePageChange(totalPages);
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
    const visiblePages = 5;

    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
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
                  ref=${searchInputRef}
                />
                ${searchTerm &&
                html`
                  <span class="clear-icon" onclick=${handleClearSearch} style=${{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}>×</span>
                `}
              </div>
            </div>
          </div>
          <div class="pagination">
          <button class="page-button" onclick=${handleFirstPage} disabled=${currentPage === 1} style=${`cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'}; margin-bottom: 5px;`}>«</button>
          <button class="prev-page" onclick=${() => handlePageChange(currentPage - 1)} disabled=${currentPage === 1} style=${`cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'}; margin-bottom: 5px;`}>Previous</button>
          ${displayPages().map((page) =>
            html`
              <button class="page-button ${currentPage === page ? 'current-page' : ''}" onclick=${() => handlePageChange(page)} disabled=${currentPage === page} style=${`cursor: ${currentPage === page ? 'not-allowed' : 'pointer'}; margin-bottom: 5px;`}>
                ${page}
              </button>
            `
          )}
          <button class="next-page" onclick=${() => handlePageChange(currentPage + 1)} disabled=${currentPage === totalPages} style=${`cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'}; margin-bottom: 5px;`}>Next</button>
          <button class="page-button" onclick=${handleLastPage} disabled=${currentPage === totalPages} style=${`cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'}; margin-bottom: 5px;`}>»</button>
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
    <button class="page-button" onclick=${handleFirstPage} disabled=${currentPage === 1} style=${`cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'}; margin-bottom: 5px;`}>«</button>
    <button class="prev-page" onclick=${() => handlePageChange(currentPage - 1)} disabled=${currentPage === 1} style=${{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
    ${displayPages().map((page) =>
      html`
        <button class="page-button ${currentPage === page ? 'current-page' : ''}" onclick=${() => handlePageChange(page)} disabled=${currentPage === page} style=${{ cursor: currentPage === page ? 'not-allowed' : 'pointer' }}>
          ${page}
        </button>
      `
    )}
    <button class="next-page" onclick=${() => handlePageChange(currentPage + 1)} disabled=${currentPage === totalPages} style=${{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
    <button class="page-button" onclick=${handleLastPage} disabled=${currentPage === totalPages} style=${{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>»</button>
    </div>
  `;
}

export default Urls;

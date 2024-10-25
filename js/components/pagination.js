import { ITEMS_PER_PAGE, MAX_API_LIMIT } from "../utils/constants.js";
import { elements } from "../utils/dom.js";
import { handleSearch } from "../handlers/search.js";
import { handleTrendingGIFs } from "../handlers/trending.js";

// Track current offsets for pagination
let currentOffsetFinder = 0,
  currentOffsetTrending = 0;

/**
 * Updates pagination controls for a given section
 * @param {Object} pagination - Pagination data from API response
 * @param {string} section - The section to update ('finder' or 'trending')
 */
export function updatePaginationControls(pagination, section) {
  // Calculate total items and pages, constrained by API limit
  const total = Math.min(pagination.total_count, MAX_API_LIMIT);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Determine current offset and page
  const offsets = {
    finder: currentOffsetFinder,
    trending: currentOffsetTrending,
  };
  const currentOffset = offsets[section];
  const currentPage = Math.floor(currentOffset / ITEMS_PER_PAGE) + 1;

  // Select the appropriate container for pagination controls
  const containers = {
    finder: elements.finderPaginationContainer,
    trending: elements.trendingPaginationContainer,
  };
  const paginationContainer = containers[section];

  // Create pagination btns HTML
  const paginationHTML = `
          <button
            class="pagination__button" ${currentPage === 1 ? "disabled" : ""} 
          data-action="prev" aria-label="Previous Page">
            <i class="pagination__icon fa-solid fa-caret-left arira-hidden="true"></i>
          </button>
          <span class="pagination__number section-${section}__pagination-number"
            >${currentPage} of ${totalPages}</span
          >
          <button
            class="pagination__button"
          ${
            currentPage === totalPages ? "disabled" : ""
          } data-action="next" aria-label="Next Page">
            <i class="pagination__icon fa-solid fa-caret-right" arira-hidden="true"></i>
          </button>
    `;
  // Update pagination container with new buttons
  paginationContainer.innerHTML = paginationHTML;

  // Add event listeners to pagination buttons
  const paginationButtons = paginationContainer.querySelectorAll(
    ".pagination__button"
  );
  paginationButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;

      // Update offset based on btn action
      if (action === "prev" && offsets[section] >= ITEMS_PER_PAGE) {
        offsets[section] -= ITEMS_PER_PAGE;
      } else if (
        action === "next" &&
        offsets[section] + ITEMS_PER_PAGE < total
      ) {
        offsets[section] += ITEMS_PER_PAGE;
      }

      // Update the corresponding offset variable and call handler
      if (section === "finder") {
        currentOffsetFinder = offsets[section];
        handleSearch(null, currentOffsetFinder);
      } else {
        currentOffsetTrending = offsets[section];
        handleTrendingGIFs(currentOffsetTrending);
      }
    });
  });
}

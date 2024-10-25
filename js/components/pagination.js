import { ITEMS_PER_PAGE, MAX_API_LIMIT } from "../utils/constants.js";
import { elements } from "../utils/dom.js";
import { handleSearch } from "../handlers/search.js";
import { handleTrendingGIFs } from "../handlers/trending.js";

let currentOffsetFinder = 0,
  currentOffsetTrending = 0;

// Function to update pagination controls
export function updatePaginationControls(pagination, section) {
  const total = Math.min(pagination.total_count, MAX_API_LIMIT);
  const offsets = {
    finder: currentOffsetFinder,
    trending: currentOffsetTrending,
  };
  const containers = {
    finder: elements.finderPaginationContainer,
    trending: elements.trendingPaginationContainer,
  };

  const currentOffset = offsets[section];
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentOffset / ITEMS_PER_PAGE) + 1;

  // Create/Update pagination btns
  const paginationHTML = `
          <button
            class="pagination__button" ${currentPage === 1 ? "disabled" : ""} 
          data-action="prev">
            <i class="pagination__icon fa-solid fa-caret-left arira-hidden="true"></i>
          </button>
          <span class="pagination__number section-${section}__pagination-number"
            >${currentPage} of ${totalPages}</span
          >
          <button
            class="pagination__button"
          ${currentPage === totalPages ? "disabled" : ""} data-action="next">
            <i class="pagination__icon fa-solid fa-caret-right"></i>
          </button>
    `;
  const paginationContainer = containers[section];
  paginationContainer.innerHTML = paginationHTML;
  const paginationButtons = paginationContainer.querySelectorAll(
    ".pagination__button"
  );
  paginationButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;

      // Update offset based on action
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

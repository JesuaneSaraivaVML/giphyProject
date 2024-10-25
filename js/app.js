"use strict";
import { handleSearch } from "../js/handlers/search.js";
import { handleTrendingGIFs } from "./handlers/trending.js";
import { elements } from "./utils/dom.js";
import { initNavigation } from "./components/navigation.js";
import { handleLoadingState } from "./utils/helpers.js";
import { handleLoadRandomGIF } from "./handlers/random.js";

// Function to add even listeners
function addEventListeners() {
  elements.nextRandomButton.addEventListener("click", () =>
    handleLoadingState(
      elements.randomSpinner,
      elements.nextRandomButton,
      handleLoadRandomGIF
    )
  );

  elements.searchForm.addEventListener("submit", (e) =>
    handleLoadingState(
      elements.finderSpinner,
      elements.finderPaginationContainer,
      () => handleSearch(e)
    )
  );
}

// Function to setup necessary event listeners and the mobile nav
function init() {
  addEventListeners();
  initNavigation();
}

init();

// initial page load of Random GIF
window.addEventListener("load", () =>
  handleLoadingState(
    elements.randomSpinner,
    elements.nextRandomButton,
    handleLoadRandomGIF
  )
);

// Initial page load of Trending GIFs
window.addEventListener("load", () =>
  handleLoadingState(
    elements.trendingSpinner,
    elements.trendingPaginationContainer,
    handleTrendingGIFs
  )
);

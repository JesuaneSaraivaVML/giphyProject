"use strict";

import { handleLoadRandomGIF } from "../js/handlers/random.js";
import { handleSearch } from "../js/handlers/search.js";
import { handleTrendingGIFs } from "./handlers/trending.js";
import { elements } from "./utils/dom.js";
import { initNavigation } from "./components/navigation.js";

function timeout(seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject("Timeout exceeded");
    }, seconds * 1000);
  });
}

// Function to add even listeners
function addEventListeners() {
  elements.nextRandomButton.addEventListener("click", handleLoadRandomGIF);
  elements.searchForm.addEventListener("submit", handleSearch);
}

function init() {
  addEventListeners();
  initNavigation();
}

// Initialize app and setup necessary event listeners
init();

window.addEventListener("load", handleLoadRandomGIF);
window.addEventListener("load", handleTrendingGIFs);

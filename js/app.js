"use strict";

import {
  URL_SEARCH,
  URL_RANDOM,
  URL_TRENDING,
  ITEMS_PER_PAGE,
  MAX_API_LIMIT,
  RATING,
} from "./utils/constants.js";

// DOM Elements
const pictureElementRandom = document.querySelector(".section-random__picture");
const nextRandomButton = document.querySelector(".section-random__next-btn");
const searchForm = document.querySelector(".section-finder__form");
const finderImageContainer = document.querySelector(".img-container--finder");
const trendingImageContainer = document.querySelector(
  ".img-container--trending"
);
const finderPaginationContainer = document.querySelector(
  ".section-finder__pagination"
);
const trendingPaginationContainer = document.querySelector(
  ".section-trending__pagination"
);

let currentOffsetFinder = 0,
  currentOffsetTrending = 0;

function timeout(seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject("Timeout exceeded");
    }, seconds * 1000);
  });
}
// Common fetch function for all API calls
async function fetchFromAPI(url) {
  try {
    // Fetch from API
    const response = await fetch(url);
    // Extract response
    const data = await response.json();
    //If request not successful, throw error
    if (data.meta.status !== 200) {
      throw new Error(JSON.stringify(data.meta));
    }
    // Return data
    return data;
  } catch (e) {
    console.error(`Error fetching from GIPHY: ${e.message}`);
    throw e;
  }
}

// TODO, to race with timeout, and then implement timer to send if it exceeds timeout
async function handleLoadRandomGIF() {
  try {
    const { data: randomResult } = await fetchFromAPI(
      `${URL_RANDOM}&rating=${RATING}`
    );
    // Get the media's URL from the Giphy API response for the original and mobile sizes
    const mediaUrlOriginal = randomResult.images.original.url;
    const mediaUrlSmall = randomResult.images.downsized.url;
    const mediaUrlMedium = randomResult.images.downsized_medium.url;

    // Get media's type
    const mediaType = randomResult.type;

    // Update the <picture> element with the appropriate sources
    pictureElementRandom.innerHTML = `
    <source srcset="${mediaUrlMedium}" media="(min-width: 768px)">
    <source srcset="${mediaUrlSmall}" media="(max-width: 599px)">
    <img class="section-random__image" src="${mediaUrlOriginal}" type="${mediaType}" alt="Random GIF">
  `;
  } catch (e) {
    // TODO improve this
    pictureElementRandom.innerHTML = `
    Error fetching random GIF: ${e}
  `;
  }
}

// Function to update pagination controls
function updatePaginationControls(pagination, section) {
  const total = Math.min(pagination.total_count, MAX_API_LIMIT);
  const offsets = {
    finder: currentOffsetFinder,
    trending: currentOffsetTrending,
  };
  const containers = {
    finder: finderPaginationContainer,
    trending: trendingPaginationContainer,
  };

  const currentOffset = offsets[section];
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentOffset / ITEMS_PER_PAGE) + 1;

  // Create/Update pagination btns
  const paginationHTML = `
          <button
            class="pagination__button" ${currentPage === 1 ? "disabled" : ""} 
          data-action="prev">
            <i class="pagination__icon fa-solid fa-caret-left"></i>
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

// TODO, to race with timeout, and then implement timer to send if it exceeds timeout
async function handleSearch(e, offset = 0) {
  e?.preventDefault(); // making it optional so we can call this function directly for pagination!!!! IMPORTANT TO KNOW

  const form = document.querySelector(".section-finder__form");
  const formData = new FormData(form);
  const query = formData.get("section-finder__input");

  try {
    const { data, pagination } = await fetchFromAPI(
      `${URL_SEARCH}&q=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );

    // Reset image container
    finderImageContainer.innerHTML = "";

    // Insert images
    data.forEach((img) => {
      const mediaUrlOriginal = img.images?.original?.url;
      const mediaUrlSmall = img.images?.downsized?.url;
      const mediaUrlMedium = img.images?.downsized_medium?.url;
      const mediaType = img.type;
      const alt = img.title;

      finderImageContainer.insertAdjacentHTML(
        "beforeend",
        `            
        <picture class="section-finder__picture">
          <source srcset="${mediaUrlMedium}" media="(min-width: 768px)">
          <source srcset="${mediaUrlSmall}" media="(max-width: 599px)">
          <img class="img-container__img" src="${mediaUrlOriginal}" type="${mediaType}" alt="${alt}">
        </picture>`
      );
    });

    // Update pagination controls
    updatePaginationControls(pagination, "finder");
  } catch (e) {
    finderImageContainer.innerHTML = `Error fetching GIFs from API: ${e}`;
  }
}

async function handleTrendingGIFs(offset = 0) {
  try {
    const { data, pagination } = await fetchFromAPI(
      `${URL_TRENDING}&rating=${RATING}&limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );

    // Reset image container
    trendingImageContainer.innerHTML = "";

    // Insert images
    data.forEach((img) => {
      const mediaUrlOriginal = img.images?.original?.url;
      const mediaUrlSmall = img.images?.downsized?.url;
      const mediaUrlMedium = img.images?.downsized_medium?.url;
      const mediaType = img.type;
      const alt = img.title;

      trendingImageContainer.insertAdjacentHTML(
        "beforeend",
        `            
        <picture class="img-container__picture">
          <source srcset="${mediaUrlMedium}" media="(min-width: 768px)">
          <source srcset="${mediaUrlSmall}" media="(max-width: 599px)">
          <img class="img-container__img" src="${mediaUrlOriginal}" type="${mediaType}" alt="${alt}">
        </picture>`
      );
    });

    // Update pagination controls
    updatePaginationControls(pagination, "trending");
  } catch (e) {
    // TODO
    console.log(e);
  }
}

// Function to add even listeners
function addEventListeners() {
  nextRandomButton.addEventListener("click", handleLoadRandomGIF);
  searchForm.addEventListener("submit", handleSearch);
}

function getOffset() {
  const headerHeight = document.querySelector("header").offsetHeight;
  const navHeight = document.querySelector(".mobile-nav").offsetHeight;
  return headerHeight + navHeight;
}

function scrollToSection(section, offset) {
  const targetPosition = section.getBoundingClientRect().top;
  const offsetPosition = targetPosition + window.scrollY - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

function updateActiveNavItem(navItems, activeItem) {
  navItems.forEach((item) => {
    item.classList.remove("mobile-nav__item--active");
    item.removeAttribute("aria-current");
  });

  activeItem.classList.add("mobile-nav__item--active");
  activeItem.setAttribute("aria-current", "page");
}

function initNavigation() {
  const navItems = document.querySelectorAll(".mobile-nav__item");
  const sections = document.querySelectorAll('section[id^="section-"]');
  const totalOffset = getOffset();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const navItem = document.querySelector(
            `.mobile-nav__item[href="#${entry.target.id}"]`
          );
          updateActiveNavItem(navItems, navItem);
        }
      });
    },
    {
      rootMargin: `-${totalOffset}px 0px 0px 0px`,
      threshold: 0.5,
    }
  );

  sections.forEach((section) => observer.observe(section));

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = document.getElementById(
        item.getAttribute("href").slice(1)
      );
      scrollToSection(targetSection, totalOffset);
    });
  });
}

function init() {
  addEventListeners();
  initNavigation();
}

// Initialize app and setup necessary event listeners
init();

window.addEventListener("load", handleLoadRandomGIF);
window.addEventListener("load", handleTrendingGIFs);

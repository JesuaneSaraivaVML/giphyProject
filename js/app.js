"use strict";

import {
  URL_SEARCH,
  URL_RANDOM,
  ITEMS_PER_PAGE,
  MAX_API_LIMIT,
} from "./utils/constants.js";

// DOM Elements
const pictureElement = document.querySelector(".section-random__picture");
const nextRandomButton = document.querySelector(".section-random__next-btn");
const searchForm = document.querySelector(".section-finder__form");
const finderImageContainer = document.querySelector(".img-container--finder");
const finderPaginationContainer = document.querySelector(
  ".section-finder__pagination"
);

let currentOffset = 0;

function timeout(seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject("Timeout exceeded");
    }, seconds * 1000);
  });
}

async function search(query, limit = 8, offset = 0) {
  try {
    // Fetch from API
    const response = await fetch(
      `${URL_SEARCH}&q=${query}&limit=${limit}&offset=${offset}`
    );
    // Extract response
    const data = await response.json();

    //If request not successful, throw error
    if (data.meta.status !== 200) throw new Error(JSON.stringify(data.meta));

    // Return data
    return { data: data.data, pagination: data.pagination };
  } catch (e) {
    console.error("Error searching GIPHY");
    throw e;
  }
}

async function randomGIF(rating = "g") {
  try {
    // Fetch from API
    const response = await fetch(`${URL_RANDOM}&rating=${rating}`);
    // Extract response
    const data = await response.json();

    //If request not successful, throw error
    if (data.meta.status !== 200) throw new Error(JSON.stringify(data.meta));

    // Return data
    return data.data;
  } catch (e) {
    console.error("Error getting random GIF");
    throw e;
  }
}

// TODO, to race with timeout, and then implement timer to send if it exceeds timeout
async function handleLoadRandomGIF() {
  try {
    const randomResult = await randomGIF();

    // Get the media's URL from the Giphy API response for the original and mobile sizes
    const mediaUrlOriginal = randomResult.images.original.url;
    const mediaUrlSmall = randomResult.images.downsized.url;
    const mediaUrlMedium = randomResult.images.downsized_medium.url;

    // Get media's type
    const mediaType = randomResult.type;

    // Update the <picture> element with the appropriate sources
    pictureElement.innerHTML = `
    <source srcset="${mediaUrlMedium}" media="(min-width: 768px)">
    <source srcset="${mediaUrlSmall}" media="(max-width: 599px)">
    <img class="section-random__image" src="${mediaUrlOriginal}" type="${mediaType}" alt="Random GIF">
  `;
  } catch (e) {
    // TODO improve this
    pictureElement.innerHTML = `
    Error fetching random GIF
  `;
  }
}

// Function to update pagination controls
function updatePaginationControls(pagination, query) {
  const total =
    pagination.total_count > MAX_API_LIMIT
      ? MAX_API_LIMIT
      : pagination.total_count;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentOffset / ITEMS_PER_PAGE) + 1;

  // Create/Update pagination btns
  const paginationHTML = `
      <div class="pagination section-finder__pagination">
          <button
            class="pagination__button" ${currentPage === 1 ? "disabled" : ""} 
          data-action="prev">
            <i class="pagination__icon fa-solid fa-caret-left"></i>
          </button>
          <span class="pagination__number section-finder__pagination-number"
            >${currentPage} of ${totalPages}</span
          >
          <button
            class="pagination__button"
          ${currentPage === totalPages ? "disabled" : ""} data-action="next">
            <i class="pagination__icon fa-solid fa-caret-right"></i>
          </button>
        </div>
    `;
  finderPaginationContainer.innerHTML = paginationHTML;
  const paginationButtons = finderPaginationContainer.querySelectorAll(
    ".pagination__button"
  );
  paginationButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "prev" && currentOffset >= ITEMS_PER_PAGE) {
        currentOffset -= ITEMS_PER_PAGE;
      } else if (action === "next" && currentOffset + ITEMS_PER_PAGE < total) {
        currentOffset += ITEMS_PER_PAGE;
      }
      handleSearch(null, currentOffset);
    });
  });
}

// TODO, to race with timeout, and then implement timer to send if it exceeds timeout
async function handleSearch(e, offset = 0) {
  e?.preventDefault(); // making it optional so we can call this function directly for pagination!!!! IMPORTANT TO KNOW

  const form =
    e?.currentTarget || document.querySelector(".section-finder__form");
  const formData = new FormData(form);
  const query = formData.get("section-finder__input");

  try {
    const result = await search(query, ITEMS_PER_PAGE, offset);
    const { data, pagination } = result;

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
    updatePaginationControls(pagination, query);
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

function init() {
  addEventListeners();
}

// Initialize app and Setup necessary event listeners
init();

// window.addEventListener("load", handleLoadRandomGIF);

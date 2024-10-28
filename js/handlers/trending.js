import { fetchFromAPI } from "../api/giphy.js";
import { URL_TRENDING, ITEMS_PER_PAGE, RATING } from "../utils/constants.js";
import { elements } from "../utils/dom.js";
import { updatePaginationControls } from "../components/pagination.js";
import { loadImages } from "../utils/helpers.js";

/**
 * Fetches and displays trending GIFs
 * @param {number} offset - Pagination offset, defaults to 0
 * @returns {Promise<void>}
 *
 * @todo Use min-width and max-width from a constant variable, not hard-coded
 * @todo Add ".error-message" class in css
 *
 * @throws {Error} Propagates errors
 */
export async function handleTrendingGIFs(offset = 0) {
  try {
    // Fetch trending GIFs with pagination parameters
    const { data, pagination } = await fetchFromAPI(
      `${URL_TRENDING}&rating=${RATING}&limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );

    // Reset image container
    elements.trendingImageContainer.innerHTML = "";

    // Process and render each GIF
    data.forEach((img) => {
      // Extract media URLs and metadata
      const mediaUrlOriginal = img.images?.original?.url;
      const mediaUrlSmall = img.images?.downsized?.url;
      const mediaUrlMedium = img.images?.downsized_medium?.url;
      const mediaType = img.type;
      const alt = img.title;

      // Create and insert picture element into container
      elements.trendingImageContainer.insertAdjacentHTML(
        "beforeend",
        `            
        <picture class="img-container__picture">
          <source srcset="${mediaUrlMedium}" media="(min-width: 768px)">
          <source srcset="${mediaUrlSmall}" media="(max-width: 599px)">
          <img class="img-container__img" src="${mediaUrlOriginal}" type="${mediaType}" alt="${alt}">
        </picture>`
      );
    });

    // Ensure all images are actually loaed before continuing
    await loadImages(elements.trendingImageContainer);

    // Update pagination controls
    updatePaginationControls(pagination, "trending");
  } catch (e) {
    console.error(`Error in trending GIFs handler: ${e}`);
    elements.trendingImageContainer.innerHTML = `
      <div class="error-message" role="alert">
        Error fetching trending GIFs
      </div>
    `;
    // Propagate error
    throw e;
  }
}

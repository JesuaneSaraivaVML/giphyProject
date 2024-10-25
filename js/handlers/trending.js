import { fetchFromAPI } from "../api/giphy.js";
import { URL_TRENDING, ITEMS_PER_PAGE, RATING } from "../utils/constants.js";
import { elements } from "../utils/dom.js";
import { updatePaginationControls } from "../components/pagination.js";

export async function handleTrendingGIFs(offset = 0) {
  try {
    const { data, pagination } = await fetchFromAPI(
      `${URL_TRENDING}&rating=${RATING}&limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );

    // Reset image container
    elements.trendingImageContainer.innerHTML = "";

    // Insert images
    data.forEach((img) => {
      const mediaUrlOriginal = img.images?.original?.url;
      const mediaUrlSmall = img.images?.downsized?.url;
      const mediaUrlMedium = img.images?.downsized_medium?.url;
      const mediaType = img.type;
      const alt = img.title;

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

    // Update pagination controls
    updatePaginationControls(pagination, "trending");
  } catch (e) {
    // TODO
    console.log(e);
  }
}

import { fetchFromAPI } from "../api/giphy.js";
import { URL_SEARCH, ITEMS_PER_PAGE, RATING } from "../utils/constants.js";
import { elements } from "../utils/dom.js";
import { updatePaginationControls } from "../components/pagination.js";

// TODO, to race with timeout, and then implement timer to send if it exceeds timeout
export async function handleSearch(e, offset = 0) {
  e?.preventDefault(); // making it optional so we can call this function directly for pagination!!!! IMPORTANT TO KNOW

  const form = document.querySelector(".section-finder__form");
  const formData = new FormData(form);
  const query = formData.get("section-finder__input");

  try {
    const { data, pagination } = await fetchFromAPI(
      `${URL_SEARCH}&q=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}&rating=${RATING}`
    );

    // Reset image container
    elements.finderImageContainer.innerHTML = "";

    // Insert images
    data.forEach((img) => {
      const mediaUrlOriginal = img.images?.original?.url;
      const mediaUrlSmall = img.images?.downsized?.url;
      const mediaUrlMedium = img.images?.downsized_medium?.url;
      const mediaType = img.type;
      const alt = img.title;

      elements.finderImageContainer.insertAdjacentHTML(
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
    console.error(e);
    elements.finderImageContainer.innerHTML = `Error fetching GIFs from API: ${e}`;
  }
}

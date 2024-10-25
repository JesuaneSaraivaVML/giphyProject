import { URL_RANDOM, RATING } from "../utils/constants.js";
import { elements } from "../utils/dom.js";
import { fetchFromAPI } from "../api/giphy.js";

// TODO, to race with timeout, and then implement timer to send if it exceeds timeout
export async function handleLoadRandomGIF() {
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
    elements.pictureElementRandom.innerHTML = `
    <source srcset="${mediaUrlMedium}" media="(min-width: 768px)">
    <source srcset="${mediaUrlSmall}" media="(max-width: 599px)">
    <img class="section-random__image" src="${mediaUrlOriginal}" type="${mediaType}" alt="Random GIF">
  `;

    // Wait for the actual image to load
    await new Promise((resolve, reject) => {
      const img = elements.pictureElementRandom.querySelector("img");
      if (img.complete) {
        // If the image is already loaded (complete), resolve immediately
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load random GIF"));
      }
    });
  } catch (e) {
    console.error(`Error in random GIF handler: ${e}`);
    elements.pictureElementRandom.innerHTML = `
    Error fetching random GIF: ${e}
  `;
    throw e;
  }
}

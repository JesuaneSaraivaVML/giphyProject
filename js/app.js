"use strict";

import { URL_SEARCH, URL_RANDOM } from "./utils/constants.js";

const pictureElement = document.querySelector(".section-random__picture");
const randomImageElement = document.querySelector(".section-random__image");

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

try {
  //   const dogResults = await search("dogs");
  // console.log(dogResults);
  //   const randomResult = await randomGIF();
  //   console.log(randomResult);
} catch (e) {
  console.log(e);
}

function updateRandomImage(src) {}

// TODO, to race with timeout, and then implement timer to send if it esceeds timeout
async function loadRandomGIF() {
  const randomResult = await randomGIF();
  console.log(randomResult);

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
}

window.addEventListener("load", loadRandomGIF);

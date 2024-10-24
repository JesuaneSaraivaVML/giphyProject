import { GIPHY_API_KEY } from "./config.js";

export const URL_SEARCH = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}`;
export const URL_RANDOM = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}`;
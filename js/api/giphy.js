/*
 * Fetches data from the GIPHY API
 * @param {string} url - The API URL
 * @returns {Promise<Object>} The API response data
 * @throws {Error} If the request fails or returns status diff than 200
 *
 * @todo Implement request timeout using Promise.race
 * @todo Add retry mechanism for failed requests (timer?)
 * */
export async function fetchFromAPI(url) {
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

// Common fetch function for all API calls
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

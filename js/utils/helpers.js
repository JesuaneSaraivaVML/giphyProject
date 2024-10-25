/**
 * Function to calculate the total offset height of fthe header plus mobile nav
 * @returns {number} Combined height of header and navigation
 */
export function getOffset() {
  const headerHeight = document.querySelector("header")?.offsetHeight;
  const navHeight = document.querySelector(".mobile-nav")?.offsetHeight;
  return headerHeight + navHeight;
}

/**
 * Function to scroll to a specified section with offset adjustment
 * @param {HTMLElement} section - The target section to scroll to
 * @param {number} offset - Offset value to adjust final scroll position
 * @returns {void}
 */
export function scrollToSection(section, offset) {
  if (!section) return;
  const targetPosition = section.getBoundingClientRect().top;
  const offsetPosition = targetPosition + window.scrollY - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

/**
 * Creates a promise that rejects after a specified timeout period
 * @param {string} msg - The error message to return
 * @param {number} seconds - The timeout duration in seconds
 * @returns {Promise} A promise that rejects after the specified timeout
 */
export function timeout(msg, seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(msg);
    }, seconds * 1000);
  });
}

/**
 * Helper function to ensure all images within a container are loaded
 * @param {HTMLElement} container - The container element with images
 * @returns {Promise<void>}
 */
export function loadImages(container, seconds = 10) {
  return Promise.race([
    new Promise((resolve, reject) => {
      const imgs = container.querySelectorAll("img");
      let loadedImages = 0;

      imgs?.forEach((img) => {
        if (img.complete) {
          // If the image is already loaded (complete)
          loadedImages++;
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === imgs.length) resolve();
          };
          img.onerror = () =>
            reject(new Error(`Failed to load image: ${img.src}`));
        }
      });

      if (loadedImages === imgs.length) resolve();
    }),
    timeout("Image loading timed out", seconds * 1000),
  ]);
}

/**
 * Manages loading states for asynchronous operations
 * @param {HTMLElement} loadingElement - The loading indicator element
 * @param {HTMLElement} [toggleElement] - Optional element to toggle visibility during loading
 * @param {Function} asyncFunction - The async function to execute
 * @returns {Promise<void>}
 *
 **/
export async function handleLoadingState(
  loadingElement,
  toggleElement,
  asyncFunction
) {
  try {
    loadingElement?.classList.remove("u-hidden");
    toggleElement?.classList.toggle("u-hidden");
    await asyncFunction();
  } catch (e) {
    console.error("Error in handling loading state:", e);
  } finally {
    loadingElement.classList.add("u-hidden");
    toggleElement?.classList.remove("u-hidden");
  }
}

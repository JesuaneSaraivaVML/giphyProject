export function toggleLoader(loaderElement, show) {
  loaderElement.classList.toggle("hidden", !show);
}

export function getOffset() {
  const headerHeight = document.querySelector("header").offsetHeight;
  const navHeight = document.querySelector(".mobile-nav").offsetHeight;
  return headerHeight + navHeight;
}

export function scrollToSection(section, offset) {
  const targetPosition = section.getBoundingClientRect().top;
  const offsetPosition = targetPosition + window.scrollY - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

export function timeout(msg, seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(msg);
    }, seconds * 1000);
  });
}

export function loadImages(container, seconds = 10) {
  return Promise.race([
    new Promise((resolve, reject) => {
      const imgs = container.querySelectorAll("img");
      let loadedImages = 0;

      if (imgs.length === 0) {
        resolve();
        return;
      }

      imgs.forEach((img) => {
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

// Helper function to handle loading states
export async function handleLoadingState(
  loadingElement,
  toggleElement,
  asyncFunction
) {
  try {
    loadingElement.classList.remove("u-hidden");
    toggleElement?.classList.toggle("u-hidden");
    await asyncFunction();
  } catch (e) {
    console.error("Error in handling loading state:", e);
  } finally {
    loadingElement.classList.add("u-hidden");
    toggleElement?.classList.remove("u-hidden");
  }
}

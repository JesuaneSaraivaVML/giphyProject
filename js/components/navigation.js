import { elements } from "../utils/dom.js";
import { getOffset, scrollToSection } from "../utils/helpers.js";

/**
 * Updates the active state of navigation items
 * @param {NodeList|Array} navItems - Collection of navigation items
 * @param {HTMLElement} activeItem - The item to set as active
 * @todo add tabindex attribute (for focus)
 */
function updateActiveNavItem(navItems, activeItem) {
  // Remove activ states from all items
  navItems.forEach((item) => {
    item.classList.remove("mobile-nav__item--active");
    item.removeAttribute("aria-current");
  });

  // Set active state for current item
  activeItem.classList.add("mobile-nav__item--active");
  activeItem.setAttribute("aria-current", "page");
}

/**
 * Initializes navigation functionality with intersection observer and click handlers
 * @todo forgot that this doesn't help screen reader --> must announce section change !!!
 */
export function initNavigation() {
  // Calculate total offset for scroll positioning
  const totalOffset = getOffset();

  // Create intersection observer to detect when sections enter viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // When a section becomes visible
        if (entry.isIntersecting) {
          // Find corresponding navigation item
          const navItem = document.querySelector(
            `.mobile-nav__item[href="#${entry.target.id}"]`
          );
          // Update active state in navigatio
          updateActiveNavItem(elements.navItems, navItem);
        }
      });
    },
    // Configure observer with offset and thresh
    {
      rootMargin: `-${totalOffset}px 0px 0px 0px`,
      threshold: 0.5,
    }
  );

  // Start observing all sections
  elements.sections.forEach((section) => observer.observe(section));

  // Add click handlers to navigation items
  elements.navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      // Get target section from href attribute
      const targetSection = document.getElementById(
        item.getAttribute("href").slice(1)
      );
      // Scroll to target section with offset
      scrollToSection(targetSection, totalOffset);
    });
  });
}

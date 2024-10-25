import { elements } from "../utils/dom.js";
import { getOffset, scrollToSection } from "../utils/helpers.js";

function updateActiveNavItem(navItems, activeItem) {
  navItems.forEach((item) => {
    item.classList.remove("mobile-nav__item--active");
    item.removeAttribute("aria-current");
  });

  activeItem.classList.add("mobile-nav__item--active");
  activeItem.setAttribute("aria-current", "page");
}

export function initNavigation() {
  const totalOffset = getOffset();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const navItem = document.querySelector(
            `.mobile-nav__item[href="#${entry.target.id}"]`
          );
          updateActiveNavItem(elements.navItems, navItem);
        }
      });
    },
    {
      rootMargin: `-${totalOffset}px 0px 0px 0px`,
      threshold: 0.5,
    }
  );

  elements.sections.forEach((section) => observer.observe(section));

  elements.navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = document.getElementById(
        item.getAttribute("href").slice(1)
      );
      scrollToSection(targetSection, totalOffset);
    });
  });
}

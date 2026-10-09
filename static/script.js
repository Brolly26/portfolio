/* Mobile sidebar toggle */

const menuToggle = document.querySelector("#menu-toggle");
const header = document.querySelector("#header");
const body = document.body;

function setMenu(open) {
  body.classList.toggle("menu-nav-active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  const icon = menuToggle.querySelector("i");
  icon.classList.toggle("bi-list", !open);
  icon.classList.toggle("bi-x", open);
  // Keep the off-screen sidebar out of the tab order while it is closed.
  if (window.matchMedia("(max-width: 1024px)").matches) {
    header.toggleAttribute("inert", !open);
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    setMenu(!body.classList.contains("menu-nav-active"));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-nav-active")) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // The sidebar is off-screen below 1024px, so it must not be tabbable there.
  const syncInert = () => {
    const narrow = window.matchMedia("(max-width: 1024px)").matches;
    // Widening past the breakpoint hides the hamburger, so an open menu would
    // leave `menu-nav-active` — and its `overflow: hidden` — stuck on <body>
    // with no visible control to clear it. The page then cannot be scrolled.
    if (!narrow && body.classList.contains("menu-nav-active")) setMenu(false);
    header.toggleAttribute("inert", narrow && !body.classList.contains("menu-nav-active"));
  };
  syncInert();
  window.addEventListener("resize", syncInert);

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (body.classList.contains("menu-nav-active")) setMenu(false);
    });
  });
}

/* Scroll-triggered reveal for [data-anime] elements */

const animeItems = document.querySelectorAll("[data-anime]");

if (animeItems.length) (function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animeItems.forEach((el) => el.classList.add("animate"));
  } else {
    // [data-anime] starts at opacity 0 and wraps the whole portfolio grid, so a
    // throw here leaves the Selected-work section invisible with nothing shown
    // to explain it. Reveal everything rather than risk that.
    if (!("IntersectionObserver" in window)) {
      animeItems.forEach((el) => el.classList.add("animate"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    animeItems.forEach((el) => io.observe(el));
  }
})();

/* Footer year */

const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

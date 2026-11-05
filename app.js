const routes = {
  "/": "pages/home.html",
  "/games": "pages/games.html",
  "/about": "pages/about.html"
};

const appContainer = document.getElementById("app");
const navLinks = document.querySelectorAll(".nav-links a");

// Load content dynamically
async function navigateTo(url) {
  history.pushState(null, null, url);
  await renderPage(url);
}

async function renderPage(url) {
  // Extract path and fall back to root if unknown
  const path = window.location.pathname;
  // Support both domain root and subpaths
  const routeKey = Object.keys(routes).find(key => 
    path === key || path.endsWith(key) || (key === "/" && (path === "" || path.endsWith("index.html")))
  ) || "/";

  const file = routes[routeKey];

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Page not found");
    const html = await response.text();
    appContainer.innerHTML = html;

    // Toggle background image on the main wrapper
    if (routeKey === "/games") {
      appContainer.classList.add("games-theme");
    } else {
      appContainer.classList.remove("games-theme");
    }

    // Update active navbar links
    navLinks.forEach(link => {
      const linkPath = link.getAttribute("href");
      if (linkPath === routeKey) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // // Update active navbar state
    // navLinks.forEach(link => {
    //   const linkPath = link.getAttribute("href");
    //   if (linkPath === routeKey) {
    //     link.classList.add("active");
    //   } else {
    //     link.classList.remove("active");
    //   }
    // });

    window.scrollTo(0, 0);
  } catch (error) {
    appContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h2>Oops! Page drifted away into the woods.</h2>
        <p style="color: var(--text-muted); margin: 1rem 0;">We couldn't load this content right now.</p>
        <a href="/" data-link class="btn-primary">Return Home</a>
      </div>
    `;
  }
}

// Intercept clicks on internal data-link anchors
document.addEventListener("click", e => {
  const targetAnchor = e.target.closest("a[data-link]");
  if (targetAnchor) {
    e.preventDefault();
    navigateTo(targetAnchor.getAttribute("href"));
  }
});

// Handle browser back and forward arrows
window.addEventListener("popstate", () => {
  renderPage(window.location.pathname);
});

// Initial boot load
document.addEventListener("DOMContentLoaded", () => {
  renderPage(window.location.pathname);
});
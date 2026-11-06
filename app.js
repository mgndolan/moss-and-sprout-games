const routes = {
  "/": "pages/home.html",
  "/games": "pages/games.html",
  "/about": "pages/about.html"
};

const appContainer = document.getElementById("app");
const navLinks = document.querySelectorAll(".nav-links a");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navLinks");
const textElement = document.querySelector('.bounce-text');
const textString = textElement.textContent.trim();

// Hamburger Menu Toggle
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navMenu.classList.toggle("open");
});

// Load content dynamically
async function navigateTo(url) {
  history.pushState(null, null, url);
  await renderPage(url);
}

async function renderPage(url) {
  const path = window.location.pathname;
  const routeKey = Object.keys(routes).find(key => 
    path === key || path.endsWith(key) || (key === "/" && (path === "" || path.endsWith("index.html")))
  ) || "/";

  const file = routes[routeKey];

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Page not found");
    const html = await response.text();
    appContainer.innerHTML = html;

    // Toggle full-page background styling on games view
    if (routeKey === "/games") {
      appContainer.classList.add("games-theme");
    } else {
      appContainer.classList.remove("games-theme");
    }

    // Update active navbar state
    navLinks.forEach(link => {
      const linkPath = link.getAttribute("href");
      if (linkPath === routeKey) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close mobile dropdown when a navigation link is clicked
    navToggle.classList.remove("open");
    navMenu.classList.remove("open");

    window.scrollTo(0, 0);
  } catch (error) {
    appContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h2>Oops! Sprout must have ran off with the page...</h2>
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

// Handle browser back and forward navigation
window.addEventListener("popstate", () => {
  renderPage(window.location.pathname);
});

// Initial boot load
document.addEventListener("DOMContentLoaded", () => {
  renderPage(window.location.pathname);
});

//// Animate "bounce-text" letters on page load
textElement.textContent = '';
textElement.setAttribute('aria-hidden', 'true');

textString.split('').forEach((char, index) => {
  const span = document.createElement('span');
  span.textContent = char;
  span.style.animationDelay = `${index * 0.1}s`;
  textElement.appendChild(span);
});
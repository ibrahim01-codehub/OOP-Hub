/* ==========================================================================
   OOP MASTERY — LANDING PAGE SCRIPT

   Sections:
   1. Theme toggle (light/dark) — swaps [data-theme] on <html>, which the
      CSS variables in styles.css key off of. Kept in-memory only (no
      localStorage) so it works reliably in every preview environment;
      see the note at the bottom of this file if you want it to persist
      across page loads once this is hosted on your own server.
   2. Mobile navigation toggle
   3. Header "scrolled" state (adds shadow once the page scrolls)
   4. Scroll-reveal animation for [data-reveal] elements
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

/* ------------------------------------------------------------------
   1. THEME TOGGLE
   ------------------------------------------------------------------ */
var root = document.documentElement;
var themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);

  if (themeToggle) {
    var isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }
}

// Always start with light theme, regardless of system preference.
setTheme('light');

if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}
  /* ------------------------------------------------------------------
     2. MOBILE NAV TOGGLE
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu whenever a nav link is chosen.
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close it on outside click too, so it doesn't stay stuck open.
    document.addEventListener('click', function (event) {
      var clickedInsideNav = mainNav.contains(event.target) || navToggle.contains(event.target);
      if (!clickedInsideNav) closeNav();
    });
  }

  /* ------------------------------------------------------------------
     3. HEADER SCROLLED STATE
     ------------------------------------------------------------------ */
  var header = document.getElementById('site-header');

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ------------------------------------------------------------------
     4. SCROLL-REVEAL
     Progressive enhancement only — see the ".js [data-reveal]" rule in
     styles.css. If IntersectionObserver isn't supported, elements are
     simply left in their default (fully visible) state.
     ------------------------------------------------------------------ */
  if ('IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll('[data-reveal]');

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  }

  /* ------------------------------------------------------------------
     HOOK POINT: #hero-code-output
     The hero's code panel (#hero-code-panel) is intentionally left
     empty — inject a code sample, syntax highlighting, or a typewriter
     animation into #hero-code-output here whenever you're ready.

     Example:
       document.getElementById('hero-code-output').textContent =
         'class Car {\n  constructor(brand) {\n    this.brand = brand;\n  }\n}';
     ------------------------------------------------------------------ */

});

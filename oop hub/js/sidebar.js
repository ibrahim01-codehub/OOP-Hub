/* ==========================================================================
   SIDEBAR — builds the topic nav inside every <div class="sidebar"></div>
   on the page. Reads its list of pages from sidebar.json, so adding,
   renaming, or reordering a topic only ever means editing that one file.

   Usage — on any page:
     <div class="sidebar"></div>
     ...
     <script src="sidebar.js" defer></script>

   That's it. No need to touch this file per-page.

   Note: this uses fetch() to load sidebar.json, so the site needs to be
   served over http:// (VS Code "Live Server", `npx serve`, etc.) — opening
   the .html file directly as file:// blocks fetch() in most browsers. If
   sidebar.json can't be reached for any reason, a built-in fallback list
   (identical to sidebar.json) is used instead, so the nav never disappears.
   ========================================================================== */

(function () {
  const ICONS = {
    "classes-objects": '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.6"/><circle cx="7.5" cy="7.5" r="1.4" fill="currentColor"/></svg>',
    "methods": '<svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M4 10h8M4 14h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    "encapsulation": '<svg viewBox="0 0 20 20" fill="none"><rect x="4" y="8" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.6"/></svg>',
    "abstraction": '<svg viewBox="0 0 20 20" fill="none"><path d="M10 3 3 7l7 4 7-4-7-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 11l7 4 7-4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    "inheritance": '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="4.5" r="2" stroke="currentColor" stroke-width="1.6"/><circle cx="5" cy="15.5" r="2" stroke="currentColor" stroke-width="1.6"/><circle cx="15" cy="15.5" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M10 6.5v3M10 9.5 5 13.5M10 9.5l5 4" stroke="currentColor" stroke-width="1.6"/></svg>',
    "polymorphism": '<svg viewBox="0 0 20 20" fill="none"><circle cx="5.5" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/><rect x="11" y="7.5" width="5" height="5" stroke="currentColor" stroke-width="1.6"/></svg>'
  };

  const FALLBACK_DATA = {
    brand: "OOP Concepts",
    items: [
      { id: "classes-objects", label: "Classes & Objects", file: "classes.html" },
      { id: "methods", label: "Methods", file: "methods.html" },
      { id: "encapsulation", label: "Encapsulation", file: "encapsulation.html" },
      { id: "abstraction", label: "Abstraction", file: "abstraction.html" },
      { id: "inheritance", label: "Inheritance", file: "inheritance.html" },
      { id: "polymorphism", label: "Polymorphism", file: "polymoorphism.html" }
    ]
  };

  function currentFile() {
    const path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function render(data, mount) {
    const active = currentFile();

    const nav = document.createElement("nav");
    nav.className = "sidebar-nav";
    nav.setAttribute("aria-label", data.brand || "Topics");

    const title = document.createElement("p");
    title.className = "sidebar-title";
    title.textContent = data.brand || "Topics";
    nav.appendChild(title);

    const list = document.createElement("ul");
    list.className = "sidebar-list";

    data.items.forEach(function (item) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.file;
      a.className = "sidebar-link" + (item.file === active ? " is-active" : "");
      if (item.file === active) a.setAttribute("aria-current", "page");
      a.innerHTML =
        '<span class="sidebar-icon">' + (ICONS[item.id] || "") + "</span>" +
        '<span class="sidebar-label">' + item.label + "</span>";
      li.appendChild(a);
      list.appendChild(li);
    });

    nav.appendChild(list);
    mount.replaceChildren(nav);
  }

  function init() {
    const mounts = document.querySelectorAll(".sidebar");
    if (!mounts.length) return;

    fetch("sidebar.json")
      .then(function (res) {
        if (!res.ok) throw new Error("sidebar.json request failed");
        return res.json();
      })
      .catch(function () {
        return FALLBACK_DATA;
      })
      .then(function (data) {
        mounts.forEach(function (mount) {
          render(data, mount);
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
/* =========================================================
   main.js – shared behaviour for every page
   (navigation, theme toggle, scroll effects, helpers)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  highlightActiveLink();
  setupThemeToggle();
  setupBackToTop();
  setupScrollReveal();
  setupTypingEffect();
  setupCounters();
  updateFooterYear();
});

/* ---------- Mobile hamburger menu ---------- */
function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close the menu after a link is chosen (mobile)
  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Highlight current page in the nav ---------- */
function highlightActiveLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ---------- Light / dark theme (remembered with localStorage) ---------- */
function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  if (!btn) return;

  const setIcon = function () {
    const dark = document.body.classList.contains("dark");
    btn.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  setIcon();

  btn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
    setIcon();
    showToast(theme === "dark" ? "Dark mode on 🌙" : "Light mode on ☀️");
  });
}

/* ---------- Back-to-top button ---------- */
function setupBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    btn.classList.toggle("show", window.scrollY > 400);
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Reveal elements as they scroll into view ---------- */
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");

      // Animate skill bars inside the revealed block (About page)
      entry.target.querySelectorAll(".skill-fill").forEach(function (bar) {
        bar.style.width = bar.dataset.level + "%";
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) { observer.observe(el); });
}

/* ---------- Typing effect on the homepage hero ---------- */
function setupTypingEffect() {
  const target = document.querySelector(".typed-text");
  if (!target) return;

  const roles = [
    "Software Engineering Student",
    "Fullstack Developer",
    "Problem Solver",
    "Lifelong Learner"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = roles[roleIndex];
    target.textContent = word.substring(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(type, 90);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 45);
    } else {
      deleting = !deleting;
      if (!deleting) roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, deleting ? 1600 : 300);
    }
  }
  type();
}

/* ---------- Count-up numbers (homepage stats) ---------- */
function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = function (el) {
    const end = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = (end * progress).toFixed(decimals) + (el.dataset.suffix || "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
}

/* ---------- Footer year ---------- */
function updateFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Small toast notification (used by other scripts) ---------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

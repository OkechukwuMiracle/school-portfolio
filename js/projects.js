/* =========================================================
   projects.js – Project filtering & details modal
   ========================================================= */

// Extra details for each project (array of objects)
const projectDetails = [
  {
    id: "portfolio",
    title: "Student Portfolio Website",
    summary: "A responsive multi-page website for showcasing my profile, skills and projects, with a built-in academic planner.",
    features: [
      "Five linked pages with a shared, responsive layout",
      "Light/dark theme saved with localStorage",
      "Scroll-reveal animations and animated skill bars",
      "Contact form with full JavaScript validation"
    ],
    role: "Solo project – design, HTML, CSS and JavaScript"
  },
  {
    id: "planner",
    title: "Academic Task Planner",
    summary: "An interactive to-do app for keeping track of assignments, tests and study goals.",
    features: [
      "Add, complete and delete tasks",
      "Filter by status and search by keyword",
      "Progress bar that updates in real time",
      "Tasks are saved in the browser so they survive a refresh"
    ],
    role: "Solo project – JavaScript DOM manipulation & arrays"
  },
  {
    id: "weather",
    title: "Campus Weather Dashboard",
    summary: "A dashboard that displays current weather and a 5-day forecast for the campus area.",
    features: [
      "Fetches data from a public weather API",
      "City search with recent-search history",
      "Responsive cards built with CSS Grid",
      "Icons that change based on weather conditions"
    ],
    role: "Personal project – API integration practice"
  },
  {
    id: "ticket",
    title: "Conference Ticket Generator",
    summary: "A three-step ticket booking app for the Techember Fest conference: choose a ticket, enter attendee details, and receive a personalised ticket.",
    features: [
      "Ticket selection: Regular (free), VIP or VVIP access",
      "Drag-and-drop profile photo upload, stored on Cloudinary",
      "Form validation for full name, email format and photo upload",
      "Ticket saved as an image with html2canvas (Download Ticket)",
      "Progress is kept in localStorage, so a refresh doesn't lose data"
    ],
    role: "Solo project – React components, routing and form handling"
  }
];

const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectCount = document.getElementById("projectCount");
const modal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
let lastFocused = null;

/* ---------- Filtering ---------- */
function filterProjects(category) {
  let shown = 0;
  projectCards.forEach(function (card) {
    const match = category === "all" || card.dataset.category === category;
    card.classList.toggle("hide", !match);
    card.classList.remove("fade-in");
    if (match) {
      void card.offsetWidth; // restart the animation
      card.classList.add("fade-in");
      shown++;
    }
  });
  projectCount.textContent = "Showing " + shown + " of " + projectCards.length + " projects";
}

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    filterProjects(btn.dataset.category);
  });
});

/* ---------- Details modal ---------- */
function openModal(projectId) {
  const project = projectDetails.find(function (p) { return p.id === projectId; });
  if (!project) return;

  const featureItems = project.features.map(function (f) {
    return "<li>" + f + "</li>";
  }).join("");

  modalBody.innerHTML =
    "<span class='eyebrow'>Project details</span>" +
    "<h3 id='modalTitle'>" + project.title + "</h3>" +
    "<p>" + project.summary + "</p>" +
    "<h4 style='margin-top:1rem'>Key features</h4>" +
    "<ul>" + featureItems + "</ul>" +
    "<p><strong>My role:</strong> " + project.role + "</p>";

  lastFocused = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll("[data-details]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    openModal(btn.dataset.details);
  });
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", function (event) {
  if (event.target === modal) closeModal(); // click on dark backdrop
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// Simulated links show a message instead of going nowhere
document.querySelectorAll("[data-simulated]").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    showToast("🔗 Demo link – this project is not hosted yet");
  });
});

filterProjects("all");

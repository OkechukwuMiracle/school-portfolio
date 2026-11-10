/* =========================================================
   planner.js – Interactive Academic Planner
   Features: add tasks, mark complete, delete, filter,
   search, progress tracking, saved in localStorage
   ========================================================= */

const STORAGE_KEY = "academicPlannerTasks";

// Array that holds every task object
let tasks = [];
let currentFilter = "all";
let searchTerm = "";

// Cached DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskTitle");
const courseInput = document.getElementById("taskCourse");
const dateInput = document.getElementById("taskDate");
const priorityInput = document.getElementById("taskPriority");
const taskError = document.getElementById("taskError");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll("[data-filter]");
const searchInput = document.getElementById("taskSearch");
const clearCompletedBtn = document.getElementById("clearCompleted");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const doneCount = document.getElementById("doneCount");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");

/* ---------- Storage helpers ---------- */
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
      return;
    } catch (e) {
      tasks = [];
    }
  }
  // Sample tasks shown the very first time the planner is opened
  tasks = [
    createTask("Complete COS 106 term project", "COS 106", addDays(5), "high"),
    createTask("Revise lecture notes on CSS Flexbox", "COS 106", addDays(2), "medium"),
    createTask("Solve calculus past questions", "MTH 101", addDays(7), "low")
  ];
  tasks[2].completed = true;
  saveTasks();
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ---------- Task helpers ---------- */
function createTask(title, course, dueDate, priority) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    title: title,
    course: course,
    dueDate: dueDate,
    priority: priority,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

function toISODate(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

function formatDate(iso) {
  if (!iso) return "No due date";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short", day: "numeric", month: "short"
  });
}

function isOverdue(task) {
  return !task.completed && task.dueDate && task.dueDate < toISODate(new Date());
}

/* ---------- Core actions ---------- */
function addTask(event) {
  event.preventDefault();
  const title = taskInput.value.trim();

  if (title === "") {
    taskError.textContent = "Please enter a task description.";
    taskInput.parentElement.classList.add("error");
    taskInput.focus();
    return;
  }

  taskError.textContent = "";
  taskInput.parentElement.classList.remove("error");

  const task = createTask(title, courseInput.value, dateInput.value, priorityInput.value);
  tasks.unshift(task); // newest first
  saveTasks();

  taskForm.reset();
  priorityInput.value = "medium";
  taskInput.focus();

  // Make sure the new task is visible
  if (currentFilter === "completed") setFilter("all");
  renderTasks();
  showToast("Task added ✅");
}

function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
  showToast(task.completed ? "Nice work! Task completed 🎉" : "Task marked as pending");
}

function deleteTask(id, itemElement) {
  // Play the slide-out animation, then remove from the array
  itemElement.classList.add("removing");
  setTimeout(function () {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    renderTasks();
    showToast("Task deleted 🗑️");
  }, 300);
}

function clearCompleted() {
  const doneTasks = tasks.filter(function (t) { return t.completed; });
  if (doneTasks.length === 0) {
    showToast("No completed tasks to clear");
    return;
  }
  if (!confirm("Remove " + doneTasks.length + " completed task(s)?")) return;
  tasks = tasks.filter(function (t) { return !t.completed; });
  saveTasks();
  renderTasks();
  showToast("Completed tasks cleared");
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(function (btn) {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active);
  });
}

function getVisibleTasks() {
  return tasks.filter(function (task) {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    const text = (task.title + " " + task.course).toLowerCase();
    const matchesSearch = text.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });
}

/* ---------- Rendering (DOM manipulation) ---------- */
function buildTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item priority-" + task.priority + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Mark \"" + task.title + "\" as completed");

  const info = document.createElement("div");
  info.className = "task-info";

  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title; // textContent prevents HTML injection

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const course = document.createElement("span");
  course.textContent = "📚 " + task.course;

  const due = document.createElement("span");
  due.textContent = "📅 " + formatDate(task.dueDate);
  if (isOverdue(task)) {
    due.classList.add("overdue");
    due.textContent += " (overdue)";
  }

  const badge = document.createElement("span");
  badge.className = "badge badge-" + task.priority;
  badge.textContent = task.priority;

  meta.append(course, due, badge);
  info.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.textContent = "✕";
  delBtn.title = "Delete task";
  delBtn.setAttribute("aria-label", "Delete \"" + task.title + "\"");

  actions.appendChild(delBtn);
  li.append(checkbox, info, actions);
  return li;
}

function renderTasks() {
  taskList.innerHTML = "";
  const visible = getVisibleTasks();

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.innerHTML = "<span>📝</span>" +
      (tasks.length === 0
        ? "No tasks yet. Add your first task using the form."
        : "No tasks match this view.");
    taskList.appendChild(empty);
  } else {
    visible.forEach(function (task) {
      taskList.appendChild(buildTaskElement(task));
    });
  }

  updateSummary();
}

function updateSummary() {
  const total = tasks.length;
  const done = tasks.filter(function (t) { return t.completed; }).length;
  const pending = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  doneCount.textContent = done;
  progressFill.style.width = percent + "%";
  progressLabel.textContent = percent + "% of tasks completed";
}

/* ---------- Event handling ---------- */
taskForm.addEventListener("submit", addTask);

taskInput.addEventListener("input", function () {
  if (taskInput.value.trim() !== "") {
    taskError.textContent = "";
    taskInput.parentElement.classList.remove("error");
  }
});

// Event delegation: one listener handles every task's checkbox & delete button
taskList.addEventListener("click", function (event) {
  const item = event.target.closest(".task-item");
  if (!item) return;

  if (event.target.classList.contains("delete-btn")) {
    deleteTask(item.dataset.id, item);
  }
});

taskList.addEventListener("change", function (event) {
  if (event.target.classList.contains("task-check")) {
    toggleTask(event.target.closest(".task-item").dataset.id);
  }
});

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setFilter(btn.dataset.filter);
    renderTasks();
  });
});

searchInput.addEventListener("input", function () {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderTasks();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

/* ---------- Start ---------- */
dateInput.min = toISODate(new Date());
loadTasks();
renderTasks();

/* =========================================================
   contact.js – Contact form validation
   Rules: no field may be empty, email must be valid,
   phone number may contain digits only
   ========================================================= */

const contactForm = document.getElementById("contactForm");
const formAlert = document.getElementById("formAlert");
const messageField = document.getElementById("message");
const charCount = document.getElementById("charCount");
const MAX_MESSAGE = 500;

// Regular expressions used for validation
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const DIGITS_ONLY = /^\d+$/;

// Each field has its own list of checks (array of functions)
const validators = {
  name: function (value) {
    if (value === "") return "Please enter your full name.";
    if (value.length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email: function (value) {
    if (value === "") return "Please enter your email address.";
    if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email (e.g. name@example.com).";
    return "";
  },
  phone: function (value) {
    if (value === "") return "Please enter your phone number.";
    if (!DIGITS_ONLY.test(value)) return "Phone number must contain digits only (no spaces, + or -).";
    if (value.length < 7 || value.length > 15) return "Phone number should be 7 to 15 digits long.";
    return "";
  },
  message: function (value) {
    if (value === "") return "Please enter a message.";
    if (value.length < 10) return "Message should be at least 10 characters.";
    return "";
  }
};

/* Validate a single field and show/hide its error message */
function validateField(input) {
  const group = input.closest(".form-group");
  const errorEl = group.querySelector(".error-msg");
  const error = validators[input.name](input.value.trim());

  errorEl.textContent = error;
  group.classList.toggle("error", error !== "");
  group.classList.toggle("success", error === "");
  input.setAttribute("aria-invalid", error !== "");

  return error === "";
}

/* Validate every field; returns true only if all pass */
function validateForm() {
  const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
  const results = fields.map(validateField);
  const firstInvalid = fields[results.indexOf(false)];
  if (firstInvalid) firstInvalid.focus();
  return results.every(Boolean);
}

function showAlert(type, message) {
  formAlert.className = "form-alert show " + type;
  formAlert.textContent = message;
}

/* ---------- Event handling ---------- */
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    showAlert("error", "⚠️ Please fix the highlighted fields and try again.");
    return;
  }

  // Simulate sending the message (no server needed for this project)
  const name = document.getElementById("name").value.trim().split(" ")[0];
  const submitBtn = contactForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  setTimeout(function () {
    contactForm.reset(); // the reset listener below clears field styles & counter
    showAlert("success", "✅ Thank you, " + name + "! Your message has been sent. I will reply within 48 hours.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
    formAlert.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 900);
});

// Validate a field when the user leaves it, and re-check while typing once it has an error
contactForm.querySelectorAll("input, textarea").forEach(function (input) {
  input.addEventListener("blur", function () {
    if (input.value.trim() !== "") validateField(input);
  });
  input.addEventListener("input", function () {
    if (input.closest(".form-group").classList.contains("error")) validateField(input);
  });
});

// Live character counter for the message box
messageField.addEventListener("input", function () {
  charCount.textContent = messageField.value.length + " / " + MAX_MESSAGE;
});

contactForm.addEventListener("reset", function () {
  formAlert.className = "form-alert";
  contactForm.querySelectorAll(".form-group").forEach(function (g) {
    g.classList.remove("success", "error");
    g.querySelector(".error-msg").textContent = "";
  });
  charCount.textContent = "0 / " + MAX_MESSAGE;
});

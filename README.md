# Student Portfolio & Academic Management Website
**COS 106 – Introduction to Web Technologies · Term Project**

Open `index.html` in any modern browser. No installation or server is needed.

## Folder structure
```
index.html      Homepage (name, photo, welcome message, biography, audio)
about.html      Education, results table, career goals, skills, hobbies, video
projects.html   4 projects with screenshots, links, filter & details pop-up
planner.html    Interactive task planner + weekly timetable table
contact.html    Contact form with JavaScript validation + FAQ
css/style.css   The single external stylesheet
js/main.js      Shared: mobile menu, dark mode, scroll animations, typing effect
js/planner.js   Task manager (add / complete / delete / filter / search / save)
js/contact.js   Form validation (empty fields, email format, digits-only phone)
js/projects.js  Project filter and details modal
images/         SVG profile photo, project screenshots, favicon, video poster
media/          welcome.wav audio clip
```

## Where each requirement is met
| Requirement | Location |
|---|---|
| Semantic HTML | `header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `footer`, `time`, `address`, `details` on every page |
| Forms | Planner task form, Contact form |
| Tables | About (course results with `thead/tbody/tfoot`), Planner (timetable with `colspan`) |
| Images | Profile photo, 4 project screenshots |
| Hyperlinks | Navigation, footer, project links, `mailto:` and `tel:` links |
| Lists | Nav (`ul`), timeline (`ol`), skills, hobbies, breadcrumbs |
| Multimedia | `<audio>` on Home, `<video>` on About |
| External CSS | `css/style.css` linked in every page |
| Responsive / mobile | Media queries at 1024px, 860px, 560px; hamburger menu on phones |
| Flexbox & Grid | Flexbox: nav, hero, task items. Grid: cards, stats, planner and contact layouts |
| Animations / transitions | Hover effects, scroll reveal, typing text, spinning photo ring, skill bars, task slide in/out |
| Consistent colours | CSS variables in `:root` (blue `#2b4acb` + amber `#f5a623`), plus dark theme |
| Event handling | click, submit, input, change, blur, keydown, scroll |
| DOM manipulation | Tasks built with `createElement`, live counters, modal content, error messages |
| Form validation | `js/contact.js`: empty fields, email regex, digits-only phone |
| Arrays & functions | `tasks` array with `filter`, `find`, `map`, `forEach`; `projectDetails` array; validator functions |
| Task management | Add, mark complete, delete, filter, search, clear completed, progress bar, saved in localStorage |

Note: The Google Font and the sample video on the About page load from the internet. Offline, the site falls back to a system font and the video poster image.

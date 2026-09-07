// FullCalendar ES6 Module - Unified Calendar Initialization
// Handles both event list pages and single event pages
import { Calendar } from "fullcalendar";
import themePlugin from "fullcalendar/themes/forma";
import dayGridPlugin from "fullcalendar/daygrid";
import timeGridPlugin from "fullcalendar/timegrid";
import listPlugin from "fullcalendar/list";
import iCalendarPlugin from "@fullcalendar/icalendar";
import allLocales from "fullcalendar/locales-all";
import rrulePlugin from "@fullcalendar/rrule";

function applyBrowserColorScheme() {
  var scheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  document.documentElement.setAttribute("data-color-scheme", scheme);
}

applyBrowserColorScheme();
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", applyBrowserColorScheme);

document.addEventListener("DOMContentLoaded", () => {
  var calendarEl = document.getElementById("calendar");

  if (!calendarEl) {
    return; // No calendar element found, exit early
  }

  // Detect if this is a single event page by checking for the specific class
  var isSingleEvent = calendarEl.classList.contains("single-event-calendar");

  // Detect browser locale with fallback
  var browserLocale = navigator.language || navigator.userLanguage || "en";
  var initialLocaleCode = browserLocale.toLowerCase();

  // Override with default locale if needed (optional)
  // var initialLocaleCode = "de";

  var localeSelectorEl = document.getElementById("locale-selector");

  // Configure calendar based on page type
  var calendarConfig = {
    plugins: [
      themePlugin,
      rrulePlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      iCalendarPlugin,
    ],
    locales: allLocales,
    locale: initialLocaleCode,
    dayMaxEvents: true,
    contentHeight: "auto", // let view rows size to content instead of using aspectRatio
    editable: false,
    navLinks: true,
    weekNumbers: true,
    events: {
      url: window.location.pathname + "/calendar.ics",
      format: "ics",
    },
    buttons: {
      next: {
        iconContent: {
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" data-attribution="cc0-icons" viewBox="0 0 24 24"><path d="m8.95 5.8 6.1 6.2-6.1 6.2"/></svg>',
        },
      },
      prev: {
        iconContent: {
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" data-attribution="cc0-icons" viewBox="0 0 24 24"><path d="M15.05 18.2 8.95 12l6.1-6.2"/></svg>',
        },
      },
    },
  };

  // Single event page configuration
  if (isSingleEvent) {
    var initialDate = calendarEl.dataset.initialDate;
    Object.assign(calendarConfig, {
      initialDate: initialDate || undefined,
      initialView: "listMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      //eventDisplay: "block",
      //eventDidMount: function (info) {
      //  // Highlight the current event with theme colors
      //  info.el.style.backgroundColor = "var(--calendar-accent-color-light)";
      //  info.el.style.borderColor = "var(--calendar-accent-color)";
      //},
    });
  }
  // Event list page configuration
  else {
    Object.assign(calendarConfig, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      weekNumbers: true,
      navLinks: true,
      editable: true,
      dayMaxEvents: true,
    });
  }

  // Initialize calendar
  var calendar = new Calendar(calendarEl, calendarConfig);
  calendar.render();

  // Build locale selector if present
  if (localeSelectorEl) {
    calendar.getAvailableLocaleCodes().forEach((localeCode) => {
      var optionEl = document.createElement("option");
      optionEl.value = localeCode;
      optionEl.selected = localeCode == initialLocaleCode;
      optionEl.innerText = localeCode;
      localeSelectorEl.appendChild(optionEl);
    });

    // Handle locale changes
    localeSelectorEl.addEventListener("change", function () {
      if (this.value) {
        calendar.setOption("locale", this.value);
      }
    });
  }
});

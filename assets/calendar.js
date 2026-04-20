// FullCalendar ES6 Module - Unified Calendar Initialization
// Handles both event list pages and single event pages
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import iCalendarPlugin from "@fullcalendar/icalendar";
import allLocales from "@fullcalendar/core/locales-all";
import rrulePlugin from "@fullcalendar/rrule";

document.addEventListener("DOMContentLoaded", function () {
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
      rrulePlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      iCalendarPlugin,
    ],
    locales: allLocales,
    locale: initialLocaleCode,
    buttonIcons: true,
    dayMaxEvents: true,
    editable: false,
    // height removed - now controlled by CSS for better responsiveness
    navLinks: true,
    weekNumbers: true,
    events: {
      url: window.location.pathname + "/calendar.ics",
      format: "ics",
    },
  };

  // Single event page configuration
  if (isSingleEvent) {
    Object.assign(calendarConfig, {
      initialView: "listMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
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
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      weekNumbers: true,
      navLinks: true,
      editable: true,
      dayMaxEvents: true,
      height: "auto",
    });
  }

  // Initialize calendar
  var calendar = new Calendar(calendarEl, calendarConfig);
  calendar.render();

  // Build locale selector if present
  if (localeSelectorEl) {
    calendar.getAvailableLocaleCodes().forEach(function (localeCode) {
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

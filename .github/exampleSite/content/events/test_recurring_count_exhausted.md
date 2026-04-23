---
title: "Test: Recurring COUNT Exhausted"
startDate: 2025-01-01T14:00:00+01:00
endDate: 2025-01-01T15:00:00+01:00
where: "Test Location"
recurrenceRule:
  freq: WEEKLY
  interval: 1
  count: 10
outputs:
  - Calendar
  - CalendarWithAlarms
---

10-week series that started January 1, 2025.
Last occurrence was March 5, 2025 (10 weeks later).
Should appear in "Past Events" section.

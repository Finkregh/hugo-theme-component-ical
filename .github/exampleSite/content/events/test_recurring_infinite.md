---
title: "Test: Recurring Infinite"
startDate: 2025-01-01T09:00:00+01:00
endDate: 2025-01-01T10:00:00+01:00
where: "Test Location"
recurrenceRule:
  freq: WEEKLY
  interval: 1
  byDay:
    - MO
outputs:
  - Calendar
  - CalendarWithAlarms
---

Weekly Monday meeting with no end date.
Started in the past but continues indefinitely.
Should appear in "Upcoming Events" section.

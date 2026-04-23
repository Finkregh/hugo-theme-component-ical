---
title: "Test: Recurring UNTIL Future"
startDate: 2026-01-01T09:00:00+01:00
endDate: 2026-01-01T10:00:00+01:00
where: "Test Location"
recurrenceRule:
  freq: WEEKLY
  interval: 1
  until: 2026-12-31T23:59:59+01:00
outputs:
  - Calendar
  - CalendarWithAlarms
---

Weekly event that continues until December 31, 2026.
Should appear in "Upcoming Events" section.

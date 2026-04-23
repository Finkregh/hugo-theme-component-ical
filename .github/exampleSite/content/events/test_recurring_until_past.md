---
title: "Test: Recurring UNTIL Past"
startDate: 2025-01-01T09:00:00+01:00
endDate: 2025-01-01T10:00:00+01:00
where: "Test Location"
recurrenceRule:
  freq: WEEKLY
  interval: 1
  until: 2025-12-31T23:59:59+01:00
outputs:
  - Calendar
  - CalendarWithAlarms
---

Weekly event that ended on December 31, 2025.
Should appear in "Past Events" section.

---
title: "Test: Recurring COUNT Active"
startDate: 2026-01-01T14:00:00+01:00
endDate: 2026-01-01T15:00:00+01:00
where: "Test Location"
recurrenceRule:
  freq: MONTHLY
  interval: 1
  count: 12
outputs:
  - Calendar
  - CalendarWithAlarms
---

12-month series starting January 1, 2026.
Last occurrence will be December 1, 2026.
Should appear in "Upcoming Events" section.

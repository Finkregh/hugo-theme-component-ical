---
title: "Test: Recurring Bare Timestamp (Site TZ)"
startDate: 2026-03-15T18:00:00
endDate: 2026-03-15T20:00:00
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

Weekly Monday event using bare timestamps (no offset).
Hugo interprets these in the site timezone (Europe/Zurich).
DTSTART should be `TZID=Europe/Zurich:20260315T180000`.
Compare with test_recurring_until_future which uses the same date/time but icaltimezone override.

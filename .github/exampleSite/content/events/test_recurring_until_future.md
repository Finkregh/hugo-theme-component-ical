---
title: "Test: Recurring with icaltimezone Override"
startDate: 2026-03-15T18:00:00
endDate: 2026-03-15T20:00:00
where: "New York Office"
icaltimezone: "America/New_York"
recurrenceRule:
  freq: WEEKLY
  interval: 1
  until: 2026-12-31T23:59:59
  byDay:
    - MO
outputs:
  - Calendar
  - CalendarWithAlarms
---

Weekly Monday event with page-level icaltimezone override to America/New_York.
Uses same bare timestamp values (18:00-20:00) as test_recurring_infinite for comparison.
With `icaltimezone`, bare timestamps are parsed in America/New_York (not site TZ).
DTSTART should be `TZID=America/New_York:20260315T180000` (18:00 EDT).
Compare: the sibling test_recurring_infinite has the same `18:00` but in Europe/Zurich.

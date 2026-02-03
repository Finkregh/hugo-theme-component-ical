---
title: "Test COUNT Parameter"
startDate: 2026-03-01T10:00:00+01:00
endDate: 2026-03-01T11:00:00+01:00
where: "Test Location"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test event with COUNT=10
recurrenceRule:
  freq: "WEEKLY"
  interval: 1
  byDay: ["WE"]
  count: 10
---

Test event to verify COUNT parameter is correctly included in RRULE.

This event should recur every Wednesday for exactly 10 occurrences.

Expected RRULE: `RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=10;BYDAY=WE`

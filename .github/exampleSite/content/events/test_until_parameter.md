---
title: "Test UNTIL Parameter"
startDate: 2026-03-01T14:00:00+01:00
endDate: 2026-03-01T15:00:00+01:00
where: "Test Location"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test event with UNTIL date
recurrenceRule:
  freq: "WEEKLY"
  interval: 1
  byDay: ["TH"]
  until: "2026-12-31T23:59:59+01:00"
---

Test event to verify UNTIL parameter is correctly included in RRULE.

This event should recur every Thursday until December 31, 2026.

Expected RRULE: `RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20261231T225959Z;BYDAY=TH`

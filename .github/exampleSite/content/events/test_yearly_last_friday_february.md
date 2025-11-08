---
title: Test Last Friday in February Yearly
startDate: 2024-02-23T16:00:00+01:00
endDate: 2024-02-23T17:30:00+01:00
where: "Annual Meeting Room"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test last Friday in February yearly: FREQ=YEARLY;INTERVAL=1;BYMONTH=2;BYDAY=-1FR
recurrenceRule:
  freq: "YEARLY"
  interval: 1
  byMonth: 2
  byDay: "-1FR"
---

This is a test event to verify the Phase 1 implementation works correctly for the last Friday in February yearly pattern. It should generate `FREQ=YEARLY;INTERVAL=1;BYMONTH=2;BYDAY=-1FR` as specified in Task 4.1 of the RFC5545 RRULE Fix Plan.

This tests:
- Phase 1: BYDAY ordinal support with negative ordinals (-1FR)
- Phase 1: BYMONTH support (February = 2)
- Phase 1: YEARLY frequency
- Phase 1: Explicit INTERVAL=1 parameter inclusion

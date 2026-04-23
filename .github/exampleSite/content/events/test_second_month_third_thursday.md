---
title: Test Every Second Month Third Thursday
startDate: 2024-03-21T14:00:00+01:00
endDate: 2024-03-21T15:30:00+01:00
where: "Conference Room C"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test every second month, third Thursday: FREQ=MONTHLY;INTERVAL=2;BYDAY=3TH
recurrenceRule:
  freq: "MONTHLY"
  interval: 2
  byDay: "3TH"
---

This is a test event to verify the Phase 1 implementation works correctly for every second month, third Thursday pattern. It should generate `FREQ=MONTHLY;INTERVAL=2;BYDAY=3TH` as specified in Task 4.1 of the RFC5545 RRULE Fix Plan.

This tests:
- Phase 1: BYDAY ordinal support (3TH)
- Phase 1: INTERVAL=2 (every second month)
- Phase 1: Explicit INTERVAL parameter inclusion

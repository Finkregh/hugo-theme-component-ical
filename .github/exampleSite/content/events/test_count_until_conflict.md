---
title: "Test COUNT and UNTIL Conflict"
startDate: 2026-03-01T16:00:00+01:00
endDate: 2026-03-01T17:00:00+01:00
where: "Test Location"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test event with both COUNT and UNTIL (should trigger error)
recurrenceRule:
  freq: "WEEKLY"
  interval: 1
  byDay: ["FR"]
  count: 20
  # Error message:
  # ERROR RRULE cannot have both COUNT and UNTIL (RFC 5545 Section 3.3.10)
  #until: "2026-12-31T23:59:59+01:00"
---

Test event to verify mutual exclusivity validation for COUNT and UNTIL.

This event has BOTH count and until parameters, which violates RFC 5545.

Expected behavior: Build should fail with error message about mutual exclusivity.

Error message should be: "RRULE cannot have both COUNT and UNTIL (RFC 5545 Section 3.3.10)"

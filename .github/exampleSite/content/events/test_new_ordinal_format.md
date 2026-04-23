---
title: Test New Ordinal BYDAY Format
startDate: 2024-02-15T14:00:00+01:00
endDate: 2024-02-15T15:30:00+01:00
where: "Conference Room A"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test the new ordinal BYDAY format: third Thursday
recurrenceRule:
  freq: "MONTHLY"
  byDay: "3TH"
---

This is a test event to verify the new ordinal BYDAY format works correctly. It should occur on the third Thursday of each month using the new `byDay: "3TH"` format instead of the old `byDay: "TH"` + `bySetPos: 3` format.

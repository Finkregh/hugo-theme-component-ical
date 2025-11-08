---
title: Test Array Ordinal Format
startDate: 2024-02-05T10:00:00+01:00
endDate: 2024-02-05T11:00:00+01:00
where: "Training Room"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test the new array ordinal BYDAY format: first and third Monday
recurrenceRule:
  freq: "MONTHLY"
  byDay: ["1MO", "3MO"]
---

This is a test event to verify the new array ordinal BYDAY format works correctly. It should occur on the first and third Monday of each month using the new `byDay: ["1MO", "3MO"]` format.

---
title: Test Last Friday Format
startDate: 2024-02-23T16:00:00+01:00
endDate: 2024-02-23T17:00:00+01:00
where: "Meeting Room B"
orga: "Test Organizer"
orgaEmail: "test@example.org"

# Test the new negative ordinal BYDAY format: last Friday
recurrenceRule:
  freq: "MONTHLY"
  byDay: "-1FR"
---

This is a test event to verify the new negative ordinal BYDAY format works correctly. It should occur on the last Friday of each month using the new `byDay: "-1FR"` format.

---
title: "Meeting with Alarm Reminders"
startDate: "2025-01-15T14:00:00"
endDate: "2025-01-15T15:30:00"
location: "Conference Room A"
orga: "John Doe"
orgaEmail: "john.doe@example.com"
alarms:
  - action: "DISPLAY"
    trigger:
      duration: "-PT15M"
    description:
      text: "Meeting starts in 15 minutes"
      lang: "en"
  - action: "EMAIL"
    trigger:
      duration: "-PT1H"
    description:
      text: "Don't forget about the meeting in 1 hour"
      lang: "en"
    summary:
      text: "Meeting Reminder"
      lang: "en"
    attendee:
      - email: "john.doe@example.com"
        commonName: "John Doe"
      - email: "jane.smith@example.com"
        commonName: "Jane Smith"
  - action: "AUDIO"
    trigger:
      duration: "-PT5M"
    attach:
      uri: "file:///System/Library/Sounds/Glass.aiff"
      mediaType: "audio/aiff"
---

This is a meeting that demonstrates VALARM functionality with multiple types of alarms:

1. **Display Alarm**: Shows a popup 15 minutes before the meeting
2. **Email Alarm**: Sends email reminders 1 hour before to attendees
3. **Audio Alarm**: Plays a sound 5 minutes before the meeting

The alarms are configured in the front matter and will be included in the generated iCalendar file.

Front matter:

```yaml
title: "Meeting with Alarm Reminders"
startDate: "2025-01-15T14:00:00"
endDate: "2025-01-15T15:30:00"
location: "Conference Room A"
orga: "John Doe"
orgaEmail: "john.doe@example.com"
alarms:
  - action: "DISPLAY"
    trigger:
      duration: "-PT15M"
    description:
      text: "Meeting starts in 15 minutes"
      lang: "en"
  - action: "EMAIL"
    trigger:
      duration: "-PT1H"
    description:
      text: "Don't forget about the meeting in 1 hour"
      lang: "en"
    summary:
      text: "Meeting Reminder"
      lang: "en"
    attendee:
      - email: "john.doe@example.com"
        commonName: "John Doe"
      - email: "jane.smith@example.com"
        commonName: "Jane Smith"
  - action: "AUDIO"
    trigger:
      duration: "-PT5M"
    attach:
      uri: "file:///System/Library/Sounds/Glass.aiff"
      mediaType: "audio/aiff"
```

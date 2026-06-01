---
title: "Hugo Conference 2026"
startDate: "2026-09-15T09:00:00"
endDate: "2026-09-15T17:00:00"
where: "Virtual Conference"
orga: "Hugo Community"
orgaEmail: "contact@gohugo.io"
externalUrl: "https://gohugo.io/conference/2026/"
---

This event demonstrates the **external URL** feature, which allows calendar events to link to external websites instead of the local Hugo page.

## External URL Feature

When you specify `externalUrl` in the front matter, the generated iCalendar file will use that URL instead of the local Hugo page permalink. This is useful for:

- **External conferences** or events hosted elsewhere
- **Registration pages** on third-party platforms
- **Zoom/Teams links** for virtual meetings
- **Ticketing systems** like Eventbrite

## Front Matter

```yaml
title: "Hugo Conference 2026"
startDate: "2026-09-15T09:00:00"
endDate: "2026-09-15T17:00:00"
where: "Virtual Conference"  # Use 'where', not 'location'
orga: "Hugo Community"
orgaEmail: "contact@gohugo.io"
externalUrl: "https://gohugo.io/conference/2026/"  # External link
```

## Implementation

The URL property in the iCalendar template uses:

```go
"url": (or .Params.externalUrl ((.OutputFormats.Get "HTML").Permalink))
```

This means:

1. If `externalUrl` is specified → use external URL
2. If `externalUrl` is empty → fallback to local Hugo page
3. The URL becomes the `URL` property in the generated `.ics` file

## Try It

Download the [calendar file](calendar.ics) and import it into your calendar app - clicking on the event will take you to the external Hugo conference website instead of this demo page.

# Hugo iCalendar Theme Component

A Hugo theme component to generate [iCalendar](https://en.wikipedia.org/wiki/ICalendar) files from your Hugo content.

This project provides a set of simple templates for [Hugo](https://gohugo.io/) to generate [iCalendar](https://en.wikipedia.org/wiki/ICalendar) files. It follows the 80/20 rule with a special focus on *event data* and strives to be RFC compliant.

**Original work:** This theme component is based on [hugo-ical-templates](https://github.com/raoulb/hugo-ical-templates) by Raoul B.

## Installation

### 1. Add Hugo module

Add this theme component as a Hugo module to your project's `hugo.toml` config file:

```toml
[module]
[[module.imports]]
path = 'github.com/finkregh/hugo-theme-component-ical'
```

Fetch or update the configured modules:

```shell
hugo mod get -u ./...
```

If you do not have npm installed and still want the entries shown as calendar scroll down to (5.).

### 2. Configure output formats

You need to configure the `Calendar` and `CalendarWithAlarms` output formats in your config:

```toml
[outputs]
  page = ["HTML", "Calendar", "CalendarWithAlarms"]
  section = ["HTML", "Calendar", "CalendarWithAlarms"]

[outputFormats.Calendar]
  baseName = "calendar"
  mediaType = "text/calendar"
  isPlainText = true
  permalinkable = true
  suffix = "ics"
  # Avoid webcal scheme
  protocol = "https://"

[outputFormats.CalendarWithAlarms]
  baseName = "calendar-alarms"
  mediaType = "text/calendar"
  isPlainText = true
  permalinkable = true
  suffix = "ics"
  # Avoid webcal scheme
  protocol = "https://"
```

The `CalendarWithAlarms` output format generates iCalendar files that include alarm/reminder components (VALARM) in addition to the event data. This allows calendar applications to display notifications and reminders for events at specified times before the event starts.

### 4. Link to calendar files

Link the generated `ics` files for download on your `html` pages:

```html
{{ with .OutputFormats.Get "Calendar" }}
    <a href="{{ .RelPermalink }}" type="text/calendar">{{ $.Title }}</a>
{{ end }}
```

For calendars with alarms:

```html
{{ with .OutputFormats.Get "CalendarWithAlarms" }}
    <a href="{{ .RelPermalink }}" type="text/calendar">{{ $.Title }} (with alarms)</a>
{{ end }}
```

### 5. (optional) display calendar via javascript

Some javascript libraries are used to display the calendar entries visually.

If you do not want to display the calendar entries on your website you can skip this section.

#### With npm

```shell
# Initial setup
hugo mod npm pack
npm update

# To get the latest version later
npm update
```

The generated (minified) javascript file can be served as a separate file or directly inside the respective webpage:

```html
<head>
    [...]
    {{ if and (.OutputFormats.Get "Calendar") (eq .Type "events") }}
    <meta http-equiv="Content-Security-Policy" content="font-src data:" />

    <!-- as separate file -->
    {{ partial "events/javascript.html" . }}
    <!-- OR inside the html -->
    {{ partial "events/javascript-inline.html" . }}

    {{ end }}
    [...]
</head>
```

Inline does not required an additional request, not-inline does make the HTML bigger. Decide for yourself what to use.

Either way the javascript will only be included in places where a calendar entry exists and it will not require loading anything from a third party (besides when building the static files).

#### Without npm

If you do not have npm installed a pre-built file is also available which you can insert into your templates:

> [!WARNING]
> This has been created manually and will not be updated with each release, use with caution!

```text
{{ $prebuilt := resources.Get "js/vendor/finkregh/ical/minified.min.2c0b8eb566757daf33d80723a369c40de708920b6faeb3f6016302e4d986635d" | resources.Fingerprint "sha256"}}
<script src="{{ $prebuilt.Permalink }}" type="module" defer></script>
```

Alternatlively load the javascript from a third party (the versions here might be outdated too!):

```html
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.19/index.global.min.js"></script>
<script src=" https://cdn.jsdelivr.net/npm/@fullcalendar/icalendar@6.1.19/index.global.min.js "></script>
<script src="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.19/locales-all.global.min.js"></script>
<script src="https://unpkg.com/ical.js/dist/ical.es5.min.cjs"></script>
{{ $themejs := resources.Get "js/vendor/finkregh/ical/script.js" | js.Build $options | resources.Minify | resources.Fingerprint "sha256"}}
<script src="{{ $themejs.Permalink }}" type="module" defer></script>
```

## Example Templates

Here are example templates for event pages, they are also used in the [demo](.github/exampleSite/layouts/events/):

### Single Event Template (`single.html`)

```html
<h2>Event meta data</h2>
<ul>
  <li>Start: {{ .Params.startDate }}</li>
  <li>End: {{ .Params.endDate }}</li>
  {{ if .Params.where }}
  <li>Location: {{ .Params.where }}</li>
  {{ end }} {{ if .Params.orga }}
  <li>Orga: {{ .Params.orga }}</li>
  {{ end }} {{ if .Params.orgaEmail }}
  <li>EMail: {{ .Params.orgaEmail }}</li>
  {{ end }} {{ if .Params.cancelled }}
  <li>Cancelled: {{ .Params.cancelled }}</li>
  {{ end }} {{ if .Params.recurrenceRule }}
  <li>
    Recurrence Rules:<br />
    <ul>
      {{ range $k, $v := .Params.recurrenceRule }}
      <li>{{ $k }}: {{ $v }}</li>
      {{ end }}
    </ul>
  </li>
  {{ end }}
</ul>

<p>
  {{ with .OutputFormats.Get "Calendar" }} Get the calendar file for this event:
  <a href="{{ .RelPermalink }}" type="text/calendar">{{ $.Title }}.ics</a>
  {{ end }}
</p>
```

### Event List Template (`list.html`)

```html
<p>
  {{ with .OutputFormats.Get "Calendar" }}
  Get the calendar file with all events (without alarms)
  <a href="{{ .RelPermalink }}" type="text/calendar">here</a>.
  {{ end }}
</p>
<p>
  {{ with .OutputFormats.Get "CalendarWithAlarms" }}
  Get the calendar file with all events (including alarms)
  <a href="{{ .RelPermalink }}" type="text/calendar">here</a>.
  {{ end }}
</p>

{{ end }}
```

## Event specification

The events are specified in the fontmatter, all parts are optional from the templating perspective, you as the user need to be aware what is required.

The time format is `{YEAR}-{MONTH}-{DAY}T{HOUR}:{MINUTE}:{SECOND}+{TIMEZONE_HOUR}:{TIMEZONE_MINUTE}`.

```yaml
---
title: Important Event!11

# First occurrence, this also defines the timeframe for the calendar entry
startDate: 2024-01-08T09:00:00+01:00
endDate:   2024-01-08T09:30:00+01:00
# Location
where: "Meeting Room 1, Main Office"
# Who created the event
orga: "Scrum Master"
# Contact
orgaEmail: "scrummaster@example.org"
---
```

You might want to look into the specifications (RFC 5545: [Internet Calendaring and Scheduling Core Object Specification (iCalendar)](https://tools.ietf.org/html/rfc5545), RFC 7986: [New Properties for iCalendar](https://tools.ietf.org/html/rfc7986)) as the examples here only show part of what is possible.

### Recurrence

The RRULE implementation supports YEARLY and MONTHLY frequencies with BYMONTH, BYDAY, and BYSETPOS components.

#### Every monday

```yaml

# Every Monday
recurrenceRule:
  freq: "WEEKLY"
  byDay: "MO"
```

#### Third Sunday of April (yearly)

```yaml
recurrenceRule:
  freq: "YEARLY"
  byMonth: 4
  byDay: "SU"
  bySetPos: 3
```

Generates: `RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=SU;BYSETPOS=3`

#### First and second Monday of October (yearly)

```yaml
recurrenceRule:
  freq: "YEARLY"
  byMonth: 10
  byDay: "MO"
  bySetPos: [1, 2]
```

Generates: `RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=MO;BYSETPOS=1,2`

#### Every last Sunday of every 3 months

```yaml
recurrenceRule:
  freq: "MONTHLY"
  interval: 3
  byDay: "SU"
  bySetPos: -1
```

Generates: `RRULE:FREQ=MONTHLY;INTERVAL=3;BYDAY=SU;BYSETPOS=-1`

### Alarm settings

The VALARM implementation supports DISPLAY, EMAIL, and AUDIO alarms with flexible trigger configurations.

> [!NOTE]
> I did not test these, so try not to wake up (others) in the middle of the night ;-)

#### Display Alarm (Popup Reminder)

```yaml
alarms:
  - action: "DISPLAY"
    trigger:
      duration: "-PT15M"  # 15 minutes before event start
    description:
      text: "Meeting starts in 15 minutes"
      lang: "en"
```

#### Email Alarm with Multiple Recipients

```yaml
alarms:
  - action: "EMAIL"
    trigger:
      duration: "-PT1H"   # 1 hour before event start
    description:
      text: "Don't forget about the meeting in 1 hour"
      lang: "en"
    summary:
      text: "Meeting Reminder"
      lang: "en"
    attendee:
      - email: "Ahmed.doe@example.com"
        commonName: "Ahmed Doe"
      - email: "jane.smith@example.com"
        commonName: "Jane Smith"
```

#### Duration Format Reference

Duration values use ISO 8601 duration format:

- `PT15M` = 15 minutes
- `PT1H` = 1 hour
- `P1D` = 1 day
- `P1W` = 1 week
- `-PT15M` = 15 minutes before (negative for "before")
- `PT15M` = 15 minutes after (positive for "after")

## About

This project does *not* provide a complete implementation of all features the iCalendar specification contains. It rather follows the 80/20 rule and with a special focus on *event data*.

All the templates strive to be RFC compliant and produce output files that adhere to the specification. No special hacks are included to work around broken calendar software or the like.

This project does not provide a full turn-key solution and some assembly will be required in most cases. Understanding of Hugo and especially Hugo's [templating system](https://gohugo.io/templates/) is still recommended.

The system is highly flexible and should adapt or extend easily to more exotic use cases. On some spots the chosen defaults might be a bit opinionated.

The partial template snippets from this project should help to easily avoid the most common mistakes when creating `ics` files. However, there is absolutely no validation, neither on the syntactic nor the semantic level. You can always use an external [validation service](https://icalendar.org/validator.html) to check the output.


## Known Issues

### No folding of long lines

Due to the way the templates work, we do not fold long lines. However, this is actually fine as the RFC writes *SHOULD* instead of *MUST*:

> Lines of text SHOULD NOT be longer than 75 octets, excluding the line break. Long content lines SHOULD be split into a multiple line representations using a line "folding" technique.

See: https://tools.ietf.org/html/rfc5545#section-3.1

### No `CRLF` line termination

This is the one place where we knowingly break RFC compliance. While this is not correct per se, it hopefully is a minor issue with today's calendar software.

> The iCalendar object is organized into individual lines of text, called content lines. Content lines are delimited by a line break, which is a CRLF sequence (CR character followed by LF character).

See: https://tools.ietf.org/html/rfc5545#section-3.1

## Specification

- RFC 5545: [Internet Calendaring and Scheduling Core Object Specification (iCalendar)](https://tools.ietf.org/html/rfc5545)
- RFC 7986: [New Properties for iCalendar](https://tools.ietf.org/html/rfc7986)

## Implementation Status

From [rfc 5545](https://tools.ietf.org/html/rfc5545)

### 3.2. Property Parameters

- [x] 3.2.1. Alternate Text Representation
- [x] 3.2.2. Common Name
- [ ] 3.2.3. Calendar User Type
- [ ] 3.2.4. Delegators
- [ ] 3.2.5. Delegatees
- [x] 3.2.6. Directory Entry Reference
- [ ] 3.2.7. Inline Encoding
- [x] 3.2.8. Format Type
- [ ] 3.2.9. Free/Busy Time Type
- [x] 3.2.10. Language
- [ ] 3.2.11. Group or List Membership
- [ ] 3.2.12. Participation Status
- [x] 3.2.13. Recurrence Identifier Range
- [ ] 3.2.14. Alarm Trigger Relationship
- [ ] 3.2.15. Relationship Type
- [ ] 3.2.16. Participation Role
- [ ] 3.2.17. RSVP Expectation
- [ ] 3.2.18. Sent By
- [x] 3.2.19. Time Zone Identifier
- [x] 3.2.20. Value Data Types

### 3.3. Property Value Data Types

- [ ] 3.3.1. Binary
- [x] 3.3.2. Boolean
- [x] 3.3.3. Calendar User Address
- [x] 3.3.4. Date
- [x] 3.3.5. Date-Time
- [x] 3.3.6. Duration
- [x] 3.3.7. Float
- [x] 3.3.8. Integer
- [ ] 3.3.9. Period of Time
- [x] 3.3.10. Recurrence Rule
- [x] 3.3.11. Text
- [x] 3.3.12. Time
- [x] 3.3.13. URI
- [ ] 3.3.14. UTC Offset

### 3.6. Calendar Components

- [x] 3.6.1. Event Component
- [ ] 3.6.2. To-Do Component
- [ ] 3.6.3. Journal Component
- [ ] 3.6.4. Free/Busy Component
- [ ] 3.6.5. Time Zone Component
- [x] 3.6.6. Alarm Component

### 3.8. Component Properties

#### 3.8.1. Descriptive Component Properties

- [ ] 3.8.1.1. Attachment
- [ ] 3.8.1.2. Categories
- [x] 3.8.1.3. Classification
- [x] 3.8.1.4. Comment
- [x] 3.8.1.5. Description
- [x] 3.8.1.6. Geographic Position
- [x] 3.8.1.7. Location
- [ ] 3.8.1.8. Percent Complete
- [ ] 3.8.1.9. Priority
- [ ] 3.8.1.10. Resources
- [x] 3.8.1.11. Status
- [x] 3.8.1.12. Summary

#### 3.8.2. Date and Time Component Properties

- [ ] 3.8.2.1. Date-Time Completed
- [x] 3.8.2.2. Date-Time End
- [ ] 3.8.2.3. Date-Time Due
- [x] 3.8.2.4. Date-Time Start
- [x] 3.8.2.5. Duration
- [ ] 3.8.2.6. Free/Busy Time
- [x] 3.8.2.7. Time Transparency

#### 3.8.4. Relationship Component Properties

- [ ] 3.8.4.1. Attendee
- [x] 3.8.4.2. Contact
- [x] 3.8.4.3. Organizer
- [x] 3.8.4.4. Recurrence ID
- [ ] 3.8.4.5. Related To
- [x] 3.8.4.6. Uniform Resource Locator
- [x] 3.8.4.7. Unique Identifier

#### 3.8.5. Recurrence Component Properties

- [ ] 3.8.5.1. Exception Date-Times
- [ ] 3.8.5.2. Recurrence Date-Times
- [x] 3.8.5.3. Recurrence Rule

#### 3.8.7. Change Management Component Properties

- [x] 3.8.7.1. Date-Time Created
- [x] 3.8.7.2. Date-Time Stamp
- [x] 3.8.7.3. Last Modified
- [x] 3.8.7.4. Sequence Number

From [rfc 7986](https://tools.ietf.org/html/rfc7986)

### 5. Properties

- [x] 5.1. NAME Property
- [x] 5.2. DESCRIPTION Property
- [x] 5.3. UID Property
- [x] 5.4. LAST-MODIFIED Property
- [x] 5.5. URL Property
- [ ] 5.6. CATEGORIES Property
- [x] 5.7. REFRESH-INTERVAL Property
- [x] 5.8. SOURCE Property
- [x] 5.9. COLOR Property
- [x] 5.10. IMAGE Property
- [ ] 5.11. CONFERENCE Property

### 6. Property Parameters

- [x] 6.1. DISPLAY Property Parameter
- [x] 6.2. EMAIL Property Parameter
- [ ] 6.3. FEATURE Property Parameter
- [ ] 6.4. LABEL Property Parameter

---

*This [hugo theme component](https://gohugo.io/hugo-modules/theme-components/) was scaffolded with the [cookiecutter-hugo-theme-component](https://github.com/devidw/cookiecutter-hugo-theme-component) template.*

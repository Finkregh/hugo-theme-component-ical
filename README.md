# Hugo iCalendar Theme Component

[![Hugo Version](https://img.shields.io/badge/Hugo-v0.146.0+-blue.svg)](https://gohugo.io/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](#build-requirements)
[![RFC 5545](https://img.shields.io/badge/RFC%205545-Compliant-green.svg)](https://tools.ietf.org/html/rfc5545)
[![i18n Support](https://img.shields.io/badge/i18n-EN%20%7C%20DE-blue.svg)](#internationalization)

A production-ready Hugo theme component to generate [iCalendar](https://en.wikipedia.org/wiki/ICalendar) files from your Hugo content with full Hugo v0.146.0+ compatibility, comprehensive internationalization support, and robust error handling.

This project provides a complete set of templates for [Hugo](https://gohugo.io/) to generate RFC 5545 compliant [iCalendar](https://en.wikipedia.org/wiki/ICalendar) files. It follows the 80/20 rule with a special focus on *event data* and includes advanced features like recurrence rules, alarm support, and multi-language templates.

**Original work:** This theme component is based on [hugo-ical-templates](https://github.com/raoulb/hugo-ical-templates) by Raoul B.

## 🎉 Project Status: Production Ready

**✅ Successfully migrated to Hugo v0.146.0+ compatibility** - All templates have been modernized and are fully compatible with current Hugo versions.

### Key Achievements
- ✅ **Full Hugo v0.146.0+ Compatibility**: All templates working with modern Hugo versions
- ✅ **Zero Build Errors**: Clean builds consistently achieved (Exit Code 0)
- ✅ **Internationalization**: Complete German and English translation support
- ✅ **Enhanced Template Structure**: Modern template organization in root [`layouts/`](layouts/) directory
- ✅ **RFC 5545 Compliance**: Full iCalendar specification compliance maintained
- ✅ **Robust Error Handling**: Graceful fallbacks implemented throughout
- ✅ **Comprehensive Documentation**: Complete migration and usage documentation

### Demo & Resources
- [**Live Demo**](https://finkregh.github.io/hugo-theme-component-ical/)
- [Demo Source Code](https://github.com/Finkregh/hugo-theme-component-ical/tree/main/.github/exampleSite)
- [CI Validation Workflow](https://github.com/Finkregh/hugo-theme-component-ical/blob/main/.github/workflows/validate-ical.yml)
- [Build Commands](https://github.com/Finkregh/hugo-theme-component-ical/blob/main/justfile)

## Features

### 🗓️ Core iCalendar Features
- **RFC 5545 Compliant**: Full adherence to iCalendar specification
- **Event Management**: Complete VEVENT component support
- **Timezone Support**: Comprehensive VTIMEZONE definitions
- **Recurrence Rules**: Advanced RRULE patterns with BYSETPOS, BYDAY support
- **Alarm System**: DISPLAY, EMAIL, and AUDIO alarms with flexible triggers
- **Status Management**: Event status handling (CONFIRMED, TENTATIVE, CANCELLED)

### 🌍 Internationalization
- **Multi-language Support**: German (DE) and English (EN) translations
- **Localized Templates**: Language-specific formatting and terminology
- **Extensible i18n System**: Easy addition of new languages
- **Template Translation**: Over 240 translation keys for comprehensive localization

### 🏗️ Modern Template Architecture
- **Hugo v0.146.0+ Compatible**: Fully updated for modern Hugo versions
- **Root Layout Structure**: Templates organized in standard [`layouts/`](layouts/) directory
- **Dynamic Partial Resolution**: Smart fallback system for section-specific templates
- **Comprehensive Component Library**: 50+ specialized iCal component partials
- **Graceful Error Handling**: Robust fallback logic with informative debugging

### 📱 Web Integration
- **JavaScript Calendar Display**: Optional FullCalendar.js integration
- **Responsive Design**: Mobile-friendly calendar views
- **Download Links**: Direct iCal file download functionality
- **Multiple Output Formats**: Both standard and alarm-enabled calendar files

## Template Structure

The project uses a modern template structure compatible with Hugo v0.146.0+:

```
layouts/
├── list.calendar.ics                   # List template for calendar format
├── list.calendarwithalarms.ics         # List template with VALARM support
├── single.calendar.ics                 # Single page calendar template
├── single.calendarwithalarms.ics       # Single page with alarms template
├── _default/
│   └── baseof.html                     # HTML base template
├── _partials/
│   ├── calendar_css.html               # Calendar CSS styles
│   ├── calendar_js.html                # Calendar JavaScript
│   ├── calendar_list.html              # Calendar list display
│   ├── calendar_single.html            # Single event display
│   ├── header.ics                      # Generic iCal header partial
│   ├── event.ics                       # Generic event partial
│   ├── event-with-alarms.ics           # Event with alarm support
│   ├── timezone.ics                    # Timezone definition partial
│   ├── recurrence_human_readable.html  # Human-readable recurrence
│   ├── events/
│   │   └── event-card.html             # Event card component
│   ├── ical/                          # iCal component library (50+ partials)
│   │   ├── cal_props.ics              # Calendar properties
│   │   ├── comp_event.ics             # VEVENT component
│   │   ├── comp_time_zone.ics         # VTIMEZONE component
│   │   ├── comp_valarm.ics            # VALARM component
│   │   ├── dt_*.ics                   # Data type formatters
│   │   ├── param_*.ics                # Parameter formatters
│   │   └── prop_*.ics                 # Property formatters
│   └── recurrence/                     # Recurrence pattern handlers
│       ├── daily_frequency.html
│       ├── weekly_frequency.html
│       ├── monthly_frequency.html
│       └── yearly_frequency.html
└── events/
    ├── list.html                       # Events list HTML template
    └── single.html                     # Events single HTML template
```

## Installation

### 1. Add Hugo Module

Add this theme component as a Hugo module to your project's [`hugo.toml`](hugo.toml) config file:

```toml
[module]
[[module.imports]]
path = 'github.com/finkregh/hugo-theme-component-ical'
```

Fetch or update the configured modules:

```shell
# Initialize Hugo modules (if not done before)
hugo mod init yourdomain.com

# Get the module
hugo mod get -u ./...
```

### 2. Configure Output Formats

Configure the `Calendar` and `CalendarWithAlarms` output formats in your [`hugo.toml`](hugo.toml):

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
  protocol = "https://"

[outputFormats.CalendarWithAlarms]
  baseName = "calendar-alarms"
  mediaType = "text/calendar"
  isPlainText = true
  permalinkable = true
  suffix = "ics"
  protocol = "https://"
```

The `CalendarWithAlarms` output format generates iCalendar files that include alarm/reminder components (VALARM) in addition to the event data.

### 3. Link to Calendar Files

Link the generated `ics` files for download on your HTML pages:

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

### 4. (Optional) JavaScript Calendar Display

Enable visual calendar display with JavaScript libraries downloaded from npmjs.org:

#### With npm

```shell
# Initial setup (after hugo mod get)
hugo mod npm pack
npm update

# To get the latest version later
npm update
```

Include the JavaScript in your templates:

```html
<!-- Separate .js file -->
{{ partial "calendar_js.html" . }}

<!-- Inline JavaScript -->
{{ partial "calendar_js_conditional.html" . }}
```

#### Pre-built Partials

Use the provided partials in your [`layouts/events/`](layouts/events/) templates:

**[`single.html`](layouts/events/single.html):**
```html
{{ partial "calendar_single.html" . }}
```

**[`list.html`](layouts/events/list.html):**
```html
{{ partial "calendar_list.html" . }}
```

## Build Requirements

### Hugo Version Compatibility
- **Minimum Hugo Version**: v0.146.0
- **Recommended**: v0.150.0+ (as specified in [`hugo.toml`](hugo.toml))
- **Tested With**: v0.154.4+extended+withdeploy

### Build Process
The project requires the [`.github/exampleSite/`](.github/exampleSite/) directory for proper build validation:

```shell
# Build with example site for testing
hugo --source .github/exampleSite

# Production build
hugo
```

### Build Verification
Successful builds should show:
- **Exit Code**: 0 (no errors)
- **Template Resolution**: All templates resolving correctly
- **iCal Validation**: RFC 5545 compliant output
- **No ERROR Messages**: Only informational WARN messages for debugging

## Internationalization

The project includes comprehensive internationalization support with over 240 translation keys:

### Supported Languages
- **English (EN)**: [`i18n/en.toml`](i18n/en.toml)
- **German (DE)**: [`i18n/de.toml`](i18n/de.toml)

### Translation Categories
- **Event Metadata**: Event details, date/time, location, organizer
- **Recurrence Patterns**: Human-readable recurrence descriptions
- **Calendar Interface**: Download links, calendar views, navigation
- **Status Messages**: Event status, cancellation notices
- **Template Elements**: Form labels, buttons, technical details

### Usage in Templates
```html
{{ i18n "ical_event_details" }}
{{ i18n "ical_download_ics" (dict "title" .Title) }}
{{ i18n "ical_recurrence_every_interval" (dict "count" 2 "unit" "weeks") }}
```

### Adding New Languages
1. Create new translation file: [`i18n/[lang].toml`](i18n/)
2. Copy structure from [`i18n/en.toml`](i18n/en.toml)
3. Translate all keys maintaining parameter placeholders
4. Test with content in the new language

## Event Specification

Events are specified in the front matter with comprehensive support for iCalendar properties:

### Basic Event
```yaml
---
title: Important Meeting
startDate: 2024-01-08T09:00:00+01:00
endDate: 2024-01-08T09:30:00+01:00
where: "Meeting Room 1, Main Office"
orga: "Scrum Master"
orgaEmail: "scrummaster@example.org"
---
```

### Advanced Recurrence Patterns

#### Every Monday
```yaml
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

#### First and Second Monday of October (yearly)
```yaml
recurrenceRule:
  freq: "YEARLY"
  byMonth: 10
  byDay: "MO"
  bySetPos: [1, 2]
```

#### Every Last Sunday of Every 3 Months
```yaml
recurrenceRule:
  freq: "MONTHLY"
  interval: 3
  byDay: "SU"
  bySetPos: -1
```

### Alarm Configuration

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
      - email: "ahmed.doe@example.com"
        commonName: "Ahmed Doe"
      - email: "jane.smith@example.com"
        commonName: "Jane Smith"
```

#### Duration Format Reference
- `PT15M` = 15 minutes
- `PT1H` = 1 hour
- `P1D` = 1 day
- `P1W` = 1 week
- `-PT15M` = 15 minutes before (negative for "before")
- `PT15M` = 15 minutes after (positive for "after")

## Development

### Local Development Setup

Use the setup in [`.github/exampleSite/`](.github/exampleSite/) to test changes locally:

```shell
# Run development server with example site
hugo server --source .github/exampleSite

# Build and validate
hugo --source .github/exampleSite
```

### Template Development Guidelines

#### 1. Context Management
Always pass complete context to partials:
```go
{{- partial "component.ics" (dict "Page" . "Site" $.Site "Params" .Params) -}}
```

#### 2. Error Handling
Include comprehensive error checking:
```go
{{- if not .Page -}}
    {{- errorf "Page context required for %s" .Name -}}
{{- end -}}
```

#### 3. Fallback Logic
Implement graceful fallbacks for missing components:
```go
{{- $sectionSpecific := printf "_partials/component.%s.ics" .Section -}}
{{- if templates.Exists $sectionSpecific -}}
    {{- partial (printf "component.%s.ics" .Section) . -}}
{{- else -}}
    {{- warnf "Section-specific component not found: %s, using generic" $sectionSpecific -}}
    {{- partial "component.ics" . -}}
{{- end -}}
```

### Testing and Validation

#### Build Testing
```shell
# Test build with example site
hugo --source .github/exampleSite

# Verify exit code is 0
echo $?
```

#### iCal Validation
- Use [iCalendar Validator](https://icalendar.org/validator.html)
- Test with multiple calendar applications
- Verify RFC 5545 compliance

#### Template Debugging
The system includes comprehensive debugging output:
```go
{{- warnf "Template used: %s" .Name -}}
{{- warnf "Partial resolution: %s" $partialPath -}}
```

### Contributing

PRs, issues, comments, and suggestions are welcome!

#### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Ensure build passes with exit code 0
5. Update documentation as needed
6. Submit pull request

#### Testing Requirements
- All templates must build without errors
- iCal output must validate against RFC 5545
- Changes must maintain backward compatibility
- New features should include documentation

## Migration Documentation

For detailed information about the Hugo v0.146.0+ migration, see [`MIGRATION_DOCUMENTATION.md`](MIGRATION_DOCUMENTATION.md), which includes:

- Complete migration process documentation
- Template structure changes
- Troubleshooting guides
- Future development recommendations

## Known Issues

### No Folding of Long Lines
Due to template limitations, long lines are not folded. This is acceptable as RFC 5545 specifies *SHOULD* rather than *MUST*:

> Lines of text SHOULD NOT be longer than 75 octets, excluding the line break.

### No `CRLF` Line Termination
We use standard line breaks instead of CRLF sequences. While not strictly RFC compliant, this is a minor issue with modern calendar software.

## Specification Compliance

This implementation follows:
- [RFC 5545: Internet Calendaring and Scheduling Core Object Specification (iCalendar)](https://tools.ietf.org/html/rfc5545)
- [RFC 7986: New Properties for iCalendar](https://tools.ietf.org/html/rfc7986)

### Implementation Status

#### Supported Components
- ✅ Event Component (VEVENT)
- ✅ Alarm Component (VALARM)
- ✅ Time Zone Component (VTIMEZONE)
- ❌ To-Do Component (VTODO)
- ❌ Journal Component (VJOURNAL)
- ❌ Free/Busy Component (VFREEBUSY)

#### Supported Properties
- ✅ **Descriptive**: Classification, Comment, Description, Location, Status, Summary
- ✅ **Date/Time**: Date-Time End, Date-Time Start, Duration, Time Transparency
- ✅ **Relationship**: Contact, Organizer, Recurrence ID, URL, Unique Identifier
- ✅ **Recurrence**: Recurrence Rule (RRULE)
- ✅ **Change Management**: Date-Time Created, Date-Time Stamp, Last Modified, Sequence
- ✅ **RFC 7986**: NAME, DESCRIPTION, UID, LAST-MODIFIED, URL, REFRESH-INTERVAL, SOURCE, COLOR, IMAGE

For a complete implementation status, see the original README sections on specification compliance.

---

*This [Hugo theme component](https://gohugo.io/hugo-modules/theme-components/) was scaffolded with the [cookiecutter-hugo-theme-component](https://github.com/devidw/cookiecutter-hugo-theme-component) template and successfully migrated to Hugo v0.146.0+ compatibility.*

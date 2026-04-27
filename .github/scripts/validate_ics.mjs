#!/usr/bin/env node

/**
 * iCalendar Validation Script for Hugo iCalendar Templates (JavaScript/Node.js)
 *
 * This script validates the generated .ics files using node-ical to ensure:
 * 1. Files are valid iCalendar format
 * 2. Cross-implementation compatibility with JavaScript parsers
 * 3. Correct recurrence rules and event properties
 * 4. Proper VALARM component handling
 * 5. Correct datetime format (TZID for event times, UTC for protocol timestamps)
 *
 * Usage:
 *     node validate_ics.mjs [base_path] [--showlog]
 *
 * Where [base_path] is the root directory containing the Hugo site structure.
 * Default: exampleSite
 */

import fs from "fs";
import path from "path";
import ical from "node-ical";
import matter from "gray-matter";
import yaml from "js-yaml";
import chalk from "chalk";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";

// Configure loglevel with prefix and colors
const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

prefix.reg(log);
prefix.apply(log, {
  format(level, name, timestamp) {
    return `${colors[level.toUpperCase()](level)}`;
  },
});

// Set default log level to ERROR (only show errors by default)
log.setDefaultLevel("error");

/**
 * Read the ical timezone from hugo.toml config.
 * Checks params.ical.timezone first, then top-level timeZone.
 */
function readSiteTimezone(basePath) {
  const hugoToml = path.join(basePath, "hugo.toml");
  if (!fs.existsSync(hugoToml)) return null;

  try {
    const content = fs.readFileSync(hugoToml, "utf-8");

    // Check [params.ical] timezone first (may appear after the section header)
    const icalTzMatch = content.match(
      /\[params\.ical\][^[]*?timezone\s*=\s*"([^"]+)"/s,
    );
    if (icalTzMatch) return icalTzMatch[1];

    // Fall back to top-level timeZone
    const topTzMatch = content.match(/^timeZone\s*=\s*['"]([^'"]+)['"]/m);
    if (topTzMatch) return topTzMatch[1];
  } catch {
    // Ignore read errors
  }
  return null;
}

class ICalValidatorJS {
  constructor(siteTimezone = null) {
    this.errors = [];
    this.warnings = [];
    this.validatedFiles = 0;
    this.startTime = Date.now();
    this.siteTimezone = siteTimezone;
  }

  /**
   * Log an error message
   */
  logError(message, icsFile = null, details = {}) {
    const formattedMessage = icsFile
      ? `${message} (file: ${icsFile})`
      : message;
    this.errors.push({ message: formattedMessage, file: icsFile, details });
    log.error(formattedMessage);
    if (Object.keys(details).length > 0) {
      log.error(`  Details: ${JSON.stringify(details, null, 2)}`);
    }
  }

  /**
   * Log a warning message
   */
  logWarning(message, icsFile = null, details = {}) {
    const formattedMessage = icsFile
      ? `${message} (file: ${icsFile})`
      : message;
    this.warnings.push({ message: formattedMessage, file: icsFile, details });
    log.warn(formattedMessage);
  }

  /**
   * Log an info message
   */
  logInfo(message, details = {}) {
    log.info(message);
    if (Object.keys(details).length > 0) {
      log.info(`  ${JSON.stringify(details)}`);
    }
  }

  /**
   * Parse YAML frontmatter from a markdown file.
   * Returns parsed data with an extra `_raw` property containing
   * the raw frontmatter string (for extracting unparsed values).
   */
  parseFrontmatter(mdPath) {
    try {
      const content = fs.readFileSync(mdPath, "utf-8");
      const { data, matter: rawFm } = matter(content);
      const result = data || {};
      result._raw = rawFm || "";
      return result;
    } catch (error) {
      this.logError(`Failed to parse frontmatter from ${mdPath}`, null, {
        error: error.message,
      });
      return {};
    }
  }

  /**
   * Extract the raw string value of `until` from frontmatter YAML.
   * gray-matter converts unquoted YAML datetimes to Date objects,
   * losing the original format. Re-parse with JSON_SCHEMA to keep strings.
   */
  getRawUntilString(frontmatter) {
    const raw = frontmatter._raw || "";
    if (!raw) return null;
    try {
      const parsed = yaml.load(raw, { schema: yaml.JSON_SCHEMA });
      const until = parsed?.recurrenceRule?.until;
      return typeof until === "string" ? until : null;
    } catch {
      return null;
    }
  }

  /**
   * Find all .ics files recursively in a directory
   */
  findIcsFiles(dir) {
    const icsFiles = [];

    const walk = (currentDir) => {
      const files = fs.readdirSync(currentDir);

      for (const file of files) {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walk(filePath);
        } else if (file.endsWith(".ics")) {
          icsFiles.push(filePath);
        }
      }
    };

    walk(dir);
    return icsFiles;
  }

  /**
   * Find the corresponding markdown file for an .ics file
   */
  findCorrespondingMarkdown(icsPath, basePath) {
    const pathParts = icsPath.split(path.sep);
    const filename = pathParts[pathParts.length - 1];

    if (filename === "calendar.ics" || filename === "calendar-alarms.ics") {
      const publicIndex = pathParts.indexOf("public");
      if (publicIndex !== -1 && publicIndex + 2 < pathParts.length) {
        const contentType = pathParts[publicIndex + 1];
        const contentName = pathParts[publicIndex + 2];
        const mdPath = path.join(
          basePath,
          "content",
          contentType,
          `${contentName}.md`,
        );

        if (fs.existsSync(mdPath)) {
          return mdPath;
        }
      }
    }
    return null;
  }

  /**
   * Check if an .ics file is a category-level calendar
   */
  isCategoryCalendar(icsPath) {
    const pathParts = icsPath.split(path.sep);
    const filename = pathParts[pathParts.length - 1];

    if (filename === "calendar.ics" || filename === "calendar-alarms.ics") {
      const publicIndex = pathParts.indexOf("public");
      if (publicIndex !== -1) {
        const partsAfterPublic = pathParts.length - publicIndex - 1;
        // Category calendars have exactly 2 parts after public (category/calendar.ics)
        // or 3 parts for language-specific (de/category/calendar.ics)
        if (partsAfterPublic === 2) {
          return true;
        }
        if (partsAfterPublic === 3 && pathParts[publicIndex + 1].length === 2) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Validate basic iCalendar structure
   */
  validateStructure(cal, icsPath) {
    this.logInfo(`Validating structure for ${path.basename(icsPath)}`);

    // Check for required calendar properties
    if (!cal.vcalendar) {
      this.logError("No VCALENDAR component found", icsPath);
      return null;
    }

    const vcal = cal.vcalendar;

    if (!vcal.version) {
      this.logError("Missing VERSION property", icsPath);
    }

    if (!vcal.prodid) {
      this.logError("Missing PRODID property", icsPath);
    }

    // Find VEVENT components
    const events = Object.values(cal).filter(
      (component) => component.type === "VEVENT",
    );

    if (events.length === 0) {
      this.logError("No VEVENT components found", icsPath);
      return null;
    }

    return events;
  }

  /**
   * Validate datetime format - accept TZID format (preferred) or UTC format
   */
  validateDateTimeFormat(dateTime, propertyName, icsPath) {
    if (!dateTime) return;

    // Check if it's a Date object (parsed by node-ical)
    if (dateTime instanceof Date) {
      // This is fine - node-ical parsed it correctly
      return;
    }

    // Check if it's a string representation
    const dateTimeStr = String(dateTime);

    // Accept UTC format (Z suffix) for protocol timestamps like DTSTAMP
    const utcFormats = [
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, // ISO format
      /^\d{8}T\d{6}Z$/, // iCal format
    ];

    // Accept TZID format for event times (DTSTART, DTEND)
    const tzidFormat = /^\d{8}T\d{6}$/; // iCal local time (no Z, used with TZID)

    const hasValidFormat =
      utcFormats.some((format) => format.test(dateTimeStr)) ||
      tzidFormat.test(dateTimeStr) ||
      dateTimeStr.includes("TZID=");

    if (!hasValidFormat) {
      this.logWarning(
        `${propertyName} format may not be standard`,
        icsPath,
        {
          actual: dateTimeStr,
          expected: "YYYYMMDDTHHMMSS (with TZID) or YYYYMMDDTHHMMSSZ (UTC)",
        },
      );
    }
  }

  /**
   * Validate event properties against frontmatter
   */
  validateEventProperties(event, frontmatter, icsPath) {
    this.logInfo(`Validating event properties for ${path.basename(icsPath)}`);

    // Check SUMMARY (title)
    if (frontmatter.title) {
      if (!event.summary) {
        this.logError("Missing SUMMARY property", icsPath);
      } else {
        // node-ical returns summary as an object with val property
        const summaryValue =
          typeof event.summary === "object" && event.summary.val
            ? event.summary.val
            : event.summary;

        if (summaryValue !== frontmatter.title) {
          this.logError("SUMMARY doesn't match title", icsPath, {
            expected: frontmatter.title,
            actual: summaryValue,
          });
        }
      }
    }

    // Check DTSTART and validate UTC format
    if (frontmatter.startDate) {
      if (!event.start) {
        this.logError("Missing DTSTART property", icsPath);
      } else {
        this.validateDateTimeFormat(event.start, "DTSTART", icsPath);
      }
    }

    // Check DTEND and validate UTC format
    if (frontmatter.endDate) {
      if (!event.end) {
        this.logError("Missing DTEND property", icsPath);
      } else {
        this.validateDateTimeFormat(event.end, "DTEND", icsPath);
      }
    }

    // Check UID
    if (!event.uid) {
      this.logError("Missing UID property", icsPath);
    }

    // Check DTSTAMP and validate UTC format
    if (!event.dtstamp) {
      this.logError("Missing DTSTAMP property", icsPath);
    } else {
      this.validateDateTimeFormat(event.dtstamp, "DTSTAMP", icsPath);
    }
  }

  /**
   * Convert a bare datetime string to UTC using a specific IANA timezone.
   * Mirrors Hugo's behavior: bare timestamps are parsed in the page timezone,
   * then converted to UTC for RRULE UNTIL.
   *
   * Uses Intl.DateTimeFormat to resolve the UTC offset for the given timezone
   * at the specific datetime, which correctly handles DST transitions.
   */
  bareToUtcMs(isoStr, timeZone) {
    // Parse components from bare ISO string (e.g., "2026-12-31T23:59:59")
    const [datePart, timePart] = isoStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = (timePart || "00:00:00")
      .split(":")
      .map(Number);

    // Target: the wall-clock digits as if they were UTC
    const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);

    // Create a formatter that outputs parts in the target timezone
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // First guess: interpret the bare datetime as UTC
    // Then compute the wall-clock time in the target timezone
    // The difference tells us the UTC offset at that moment
    const parts = fmt.formatToParts(new Date(targetAsUtc));
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    const wallAsUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second"),
    );
    // offset = wallClock(asUTC) - utcInstant → positive means TZ is ahead of UTC
    const offset = wallAsUtc - targetAsUtc;
    // The UTC instant where wall clock equals our target:
    // wallClock = utcInstant + offset → utcInstant = target - offset
    return targetAsUtc - offset;
  }

  /**
   * Parse an RRULE UNTIL value to UTC milliseconds.
   * node-ical may return Date, Temporal.ZonedDateTime, or string.
   */
  icalUtcToMs(val) {
    // Handle Temporal.ZonedDateTime (node-ical with Temporal support)
    if (val && typeof val === "object" && val.epochMilliseconds !== undefined) {
      return Number(val.epochMilliseconds);
    }

    // Handle Date objects
    if (val instanceof Date) {
      return val.getTime();
    }

    let cleanStr = String(val).replace(/\[.*\]$/, "");

    // iCal UTC format: YYYYMMDDTHHMMSSZ
    if (cleanStr.match(/^\d{8}T\d{6}Z$/)) {
      const y = cleanStr.substring(0, 4);
      const m = cleanStr.substring(4, 6);
      const d = cleanStr.substring(6, 8);
      const h = cleanStr.substring(9, 11);
      const mi = cleanStr.substring(11, 13);
      const s = cleanStr.substring(13, 15);
      return Date.UTC(+y, +m - 1, +d, +h, +mi, +s);
    }

    // ISO format with or without offset
    const date = new Date(cleanStr);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
    return null;
  }

  /**
   * Validate VALARM components
   */
  validateValarmComponents(event, frontmatter, icsPath) {
    const isAlarmsFile = icsPath.includes("calendar-alarms.ics");

    // node-ical doesn't parse VALARM components directly in the event object
    // We need to check the raw iCalendar data
    const icsContent = fs.readFileSync(icsPath, "utf-8");
    const hasValarm = icsContent.includes("BEGIN:VALARM");

    if (!frontmatter.alarms) {
      if (hasValarm) {
        this.logError("Unexpected VALARM components found", icsPath);
      }
      return;
    }

    this.logInfo(`Validating VALARM components for ${path.basename(icsPath)}`);

    const expectedAlarms = frontmatter.alarms;

    if (isAlarmsFile) {
      if (!hasValarm) {
        this.logError(
          "Expected VALARM components but none found in alarms file",
          icsPath,
          {
            expected: expectedAlarms.length,
            actual: 0,
          },
        );
      }
    } else {
      // Regular calendar.ics files should NOT contain VALARM
      if (hasValarm) {
        this.logError(
          "Regular calendar file should not contain VALARM components",
          icsPath,
        );
      }
    }
  }

  /**
   * Validate a single .ics file
   */
  async validateIcsFile(icsPath, mdPath = null) {
    this.logInfo(`Validating file: ${icsPath}`);

    try {
      // Parse the iCalendar file
      const cal = ical.parseFile(icsPath);

      // Validate basic structure
      const events = this.validateStructure(cal, icsPath);
      if (!events || events.length === 0) {
        return false;
      }

      // If we have a corresponding markdown file, validate against it
      if (mdPath && fs.existsSync(mdPath)) {
        const frontmatter = this.parseFrontmatter(mdPath);
        if (frontmatter && Object.keys(frontmatter).length > 0) {
          const event = events[0]; // Validate first event
          this.validateEventProperties(event, frontmatter, icsPath);
          this.validateRecurrenceRule(event, frontmatter, icsPath);
          this.validateValarmComponents(event, frontmatter, icsPath);
        }
      }

      this.validatedFiles++;
      return true;
    } catch (error) {
      this.logError(`Failed to parse file: ${error.message}`, icsPath, {
        error: error.stack,
      });
      return false;
    }
  }

  /**
   * Validate COUNT parameter
   */
  validateCount(rruleOpts, expectedRule, icsPath) {
    if (expectedRule.count !== undefined) {
      const expectedCount = expectedRule.count;
      const actualCount = rruleOpts.count;

      if (actualCount !== expectedCount) {
        this.logError("COUNT mismatch", icsPath, {
          expected: expectedCount,
          actual: actualCount,
        });
      } else {
        // Informational output
        console.log(
          `ℹ️  Event will occur ${expectedCount} times (COUNT=${expectedCount})`,
        );
      }
    }
  }

  /**
   * Validate UNTIL parameter.
   * Hugo converts UNTIL timestamps to UTC using the page timezone
   * (icaltimezone or site timezone). We replicate that conversion here.
   *
   * gray-matter parses bare YAML datetimes (e.g., 2026-12-31T23:59:59)
   * into Date objects using the machine's local timezone. But Hugo parses
   * them using the page timezone. So for bare timestamps, we extract the
   * wall-clock components and re-interpret in the page timezone.
   */
  validateUntil(rruleOpts, expectedRule, icsPath, frontmatter = {}) {
    if (expectedRule.until === undefined) return;

    const actualUntil = rruleOpts.until;

    if (!actualUntil) {
      this.logError("UNTIL missing", icsPath, {
        expected: expectedRule.until,
        actual: null,
      });
      return;
    }

    // Determine the page timezone (mirrors get_timezone.ics priority)
    const pageTz =
      frontmatter.icaltimezone || this.siteTimezone || "UTC";

    // Get the raw UNTIL string from frontmatter YAML to avoid
    // gray-matter's timezone-dependent Date conversion.
    const rawUntil = this.getRawUntilString(frontmatter);
    const untilStr = rawUntil || String(expectedRule.until);

    // Compute expected UTC milliseconds from frontmatter UNTIL + page timezone.
    // Hugo uses (time.AsTime <value> $timezone).UTC:
    //   - Bare timestamps → parsed in page timezone, converted to UTC
    //   - Offset timestamps → offset is respected, converted to UTC
    let expectedMs;

    if (untilStr.match(/[+-]\d{2}:\d{2}$/) || untilStr.endsWith("Z")) {
      // Explicit offset — parse directly (Hugo respects the offset)
      expectedMs = new Date(untilStr).getTime();
    } else {
      // Bare timestamp — Hugo interprets in page timezone, then .UTC
      const bareStr = untilStr.substring(0, 19);
      expectedMs = this.bareToUtcMs(bareStr, pageTz);
    }

    // Compute actual UTC milliseconds from the ICS RRULE UNTIL value
    const actualMs = this.icalUtcToMs(actualUntil);

    if (expectedMs === null || actualMs === null || isNaN(expectedMs) || isNaN(actualMs)) {
      this.logWarning(
        `Could not parse UNTIL for comparison`,
        icsPath,
        { expected: untilStr, actual: String(actualUntil) },
      );
      return;
    }

    if (expectedMs === actualMs) {
      const readableDate = new Date(actualMs).toISOString().split("T")[0];
      console.log(
        `ℹ️  Event will occur until ${readableDate} (UNTIL=${untilStr})`,
      );
    } else {
      this.logError("UNTIL mismatch", icsPath, {
        expected: untilStr,
        actual: String(actualUntil),
        expectedUtcMs: expectedMs,
        actualUtcMs: actualMs,
      });
    }
  }

  /**
   * Validate COUNT and UNTIL mutual exclusivity
   */
  validateCountUntilMutualExclusivity(rruleOpts, expectedRule, icsPath) {
    const hasCount = expectedRule.count !== undefined;
    const hasUntil = expectedRule.until !== undefined;
    const actualCount = rruleOpts.count;
    const actualUntil = rruleOpts.until;

    if (actualCount !== undefined && actualUntil !== undefined) {
      this.logError(
        "COUNT and UNTIL are mutually exclusive (RFC 5545 violation)",
        icsPath,
        {
          count: actualCount,
          until: actualUntil,
        },
      );
    }
  }

  /**
   * Check if BYDAY+BYSETPOS was converted to ordinal format
   */
  isOrdinalConversion(expectedDay, expectedSetPos, actualDay) {
    // Single day + single position should convert to ordinal
    if (
      Array.isArray(expectedDay) &&
      expectedDay.length === 1 &&
      typeof expectedSetPos === "number" &&
      Array.isArray(actualDay) &&
      actualDay.length === 1
    ) {
      const day = expectedDay[0];
      const pos = expectedSetPos;
      const expectedOrdinal = `${pos}${day}`;

      return actualDay[0] === expectedOrdinal;
    }
    return false;
  }

  /**
   * Validate recurrence rule against frontmatter
   */
  validateRecurrenceRule(event, frontmatter, icsPath) {
    if (!frontmatter.recurrenceRule) {
      return; // No recurrence rule expected
    }

    if (!event.rrule) {
      this.logError("Expected RRULE but none found", icsPath);
      return;
    }

    // node-ical stores parsed RRULE in _rrule.opts
    let rruleOpts = {};
    if (event.rrule._rrule && event.rrule._rrule.opts) {
      rruleOpts = event.rrule._rrule.opts;
    } else if (event.rrule.opts) {
      rruleOpts = event.rrule.opts;
    }

    const expectedRule = frontmatter.recurrenceRule;

    // Validate FREQ
    if (expectedRule.freq) {
      const actualFreq = rruleOpts.freq;
      if (!actualFreq || actualFreq !== expectedRule.freq) {
        this.logError("FREQ mismatch", icsPath, {
          expected: expectedRule.freq,
          actual: actualFreq,
        });
      }
    }

    // Validate INTERVAL (should always be present)
    const expectedInterval = expectedRule.interval || 1;
    const actualInterval = rruleOpts.interval;
    if (actualInterval === undefined || actualInterval !== expectedInterval) {
      this.logError(
        "INTERVAL mismatch (INTERVAL is always required)",
        icsPath,
        {
          expected: expectedInterval,
          actual: actualInterval,
        },
      );
    }

    // Validate COUNT and UNTIL parameters
    this.validateCount(rruleOpts, expectedRule, icsPath);
    this.validateUntil(rruleOpts, expectedRule, icsPath, frontmatter);
    this.validateCountUntilMutualExclusivity(rruleOpts, expectedRule, icsPath);

    // Validate BYMONTH
    if (expectedRule.byMonth) {
      const expectedMonth = Array.isArray(expectedRule.byMonth)
        ? expectedRule.byMonth
        : [expectedRule.byMonth];
      const actualMonth = rruleOpts.bymonth || rruleOpts.byMonth;

      if (JSON.stringify(actualMonth) !== JSON.stringify(expectedMonth)) {
        this.logError("BYMONTH mismatch", icsPath, {
          expected: expectedMonth,
          actual: actualMonth,
        });
      }
    }

    // Validate BYDAY (with ordinal format conversion)
    if (expectedRule.byDay) {
      let expectedDay = Array.isArray(expectedRule.byDay)
        ? expectedRule.byDay
        : [expectedRule.byDay];

      const actualDay = rruleOpts.byDay || rruleOpts.byday;

      // Check if ordinal conversion occurred
      let ordinalConversionValid = false;
      if (expectedRule.bySetPos && expectedDay.length === 1) {
        const setPos = Array.isArray(expectedRule.bySetPos)
          ? expectedRule.bySetPos[0]
          : expectedRule.bySetPos;

        // Check if this is a single day + single position that should convert to ordinal
        if (typeof setPos === "number") {
          ordinalConversionValid = this.isOrdinalConversion(
            expectedDay,
            setPos,
            actualDay,
          );
        }
      }

      // If no valid ordinal conversion, do direct comparison
      if (
        !ordinalConversionValid &&
        JSON.stringify(actualDay) !== JSON.stringify(expectedDay)
      ) {
        this.logError("BYDAY mismatch", icsPath, {
          expected: expectedDay,
          actual: actualDay,
        });
      }
    }

    // Validate BYSETPOS (should be absent if converted to ordinal BYDAY)
    if (expectedRule.bySetPos) {
      const expectedDay = expectedRule.byDay;
      const actualSetPos = rruleOpts.bysetpos || rruleOpts.bySetPos;

      // Normalize expectedDay to array
      const expectedDayArray = Array.isArray(expectedDay)
        ? expectedDay
        : [expectedDay];

      // Normalize expectedSetPos to get single value or array
      const expectedSetPosArray = Array.isArray(expectedRule.bySetPos)
        ? expectedRule.bySetPos
        : [expectedRule.bySetPos];

      // If single day + single position, BYSETPOS should be absent (converted to ordinal)
      if (expectedDayArray.length === 1 && expectedSetPosArray.length === 1) {
        if (actualSetPos !== undefined) {
          this.logError(
            "BYSETPOS should be absent (converted to ordinal BYDAY format)",
            icsPath,
            {
              expected: undefined,
              actual: actualSetPos,
              note: "Single day + single position should convert to ordinal BYDAY format",
            },
          );
        }
      } else {
        // Multiple days or positions - BYSETPOS should be present
        if (
          JSON.stringify(actualSetPos) !== JSON.stringify(expectedRule.bySetPos)
        ) {
          this.logError("BYSETPOS mismatch", icsPath, {
            expected: expectedRule.bySetPos,
            actual: actualSetPos,
          });
        }
      }
    }
  }

  /**
   * Validate a category-level calendar file
   */
  async validateCategoryCalendar(icsPath) {
    this.logInfo(`Validating category calendar: ${icsPath}`);

    try {
      const cal = ical.parseFile(icsPath);

      // Check for required calendar properties
      if (!cal.vcalendar) {
        this.logError(
          "No VCALENDAR component found in category calendar",
          icsPath,
        );
        return false;
      }

      const vcal = cal.vcalendar;

      if (!vcal.version) {
        this.logError("Missing VERSION property in category calendar", icsPath);
      }

      if (!vcal.prodid) {
        this.logError("Missing PRODID property in category calendar", icsPath);
      }

      // Find all VEVENT components
      const events = Object.values(cal).filter(
        (component) => component.type === "VEVENT",
      );

      if (events.length === 0) {
        this.logWarning(
          "No VEVENT components found in category calendar",
          icsPath,
        );
        return true;
      }

      this.logInfo(`Found ${events.length} events in category calendar`, {
        file: icsPath,
      });

      // Validate each event's basic structure
      for (const event of events) {
        const eventSummary = event.summary || "Unknown Event";

        if (!event.uid) {
          this.logError(
            `Event '${eventSummary}' missing UID in category calendar`,
            icsPath,
          );
        }

        if (!event.start) {
          this.logError(
            `Event '${eventSummary}' missing DTSTART in category calendar`,
            icsPath,
          );
        }

        if (!event.dtstamp) {
          this.logError(
            `Event '${eventSummary}' missing DTSTAMP in category calendar`,
            icsPath,
          );
        }

        // Validate RRULE if present
        if (event.rrule) {
          // node-ical stores parsed RRULE in _rrule.opts or opts
          let rruleOpts = {};
          if (event.rrule._rrule && event.rrule._rrule.opts) {
            rruleOpts = event.rrule._rrule.opts;
          } else if (event.rrule.opts) {
            rruleOpts = event.rrule.opts;
          }

          // Check INTERVAL (should always be present, defaults to 1)
          if (rruleOpts.interval === undefined) {
            this.logError(
              `Event '${eventSummary}' RRULE missing INTERVAL (should default to 1)`,
              icsPath,
            );
          }
        }
      }

      return this.errors.length === 0;
    } catch (error) {
      this.logError(
        `Failed to parse category calendar: ${error.message}`,
        icsPath,
      );
      return false;
    }
  }

  /**
   * Validate all .ics files in the base path
   */
  async validateAllFiles(basePath) {
    const startTime = Date.now();
    console.log(
      chalk.blue(
        `\nStarting JavaScript iCalendar validation for: ${basePath}\n`,
      ),
    );

    const publicDir = path.join(basePath, "public");

    if (!fs.existsSync(publicDir)) {
      this.logError(`Public directory not found: ${publicDir}`);
      return false;
    }

    // Find all .ics files
    const icsFiles = this.findIcsFiles(publicDir);

    if (icsFiles.length === 0) {
      this.logError(`No .ics files found in ${publicDir}`);
      return false;
    }

    this.logInfo(`Found ${icsFiles.length} .ics files to validate`);

    // Separate individual event calendars from category calendars
    const individualCalendars = [];
    const categoryCalendars = [];

    for (const icsFile of icsFiles) {
      if (this.isCategoryCalendar(icsFile)) {
        categoryCalendars.push(icsFile);
      } else {
        individualCalendars.push(icsFile);
      }
    }

    this.logInfo(
      `Categorized files: ${individualCalendars.length} individual, ${categoryCalendars.length} category`,
    );

    let success = true;

    // Validate individual event calendars
    console.log(chalk.cyan(`\nValidating individual event calendars...`));
    for (const icsFile of individualCalendars.sort()) {
      const mdFile = this.findCorrespondingMarkdown(icsFile, basePath);
      if (!(await this.validateIcsFile(icsFile, mdFile))) {
        success = false;
      }
    }

    // Validate category calendars
    console.log(chalk.cyan(`\nValidating category calendars...`));
    for (const icsFile of categoryCalendars.sort()) {
      if (!(await this.validateCategoryCalendar(icsFile))) {
        success = false;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(3);
    console.log(`\n⏱️  Total validation: ${duration}s`);

    return success;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log(`\n${"=".repeat(50)}`);
    console.log("JavaScript iCalendar Validation Report");
    console.log("=".repeat(50));
    console.log(`Validation Date: ${new Date().toISOString()}`);
    console.log(`Files validated: ${this.validatedFiles}`);
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log("");

    // Statistics
    if (this.validatedFiles > 0) {
      const errorRate = (
        (this.errors.length / this.validatedFiles) *
        100
      ).toFixed(1);
      const warningRate = (
        (this.warnings.length / this.validatedFiles) *
        100
      ).toFixed(1);
      console.log("STATISTICS:");
      console.log(`  Error rate: ${errorRate}%`);
      console.log(`  Warning rate: ${warningRate}%`);
      console.log("");
    }

    // Group errors by file
    if (this.errors.length > 0) {
      console.log("ERRORS:");
      const errorsByFile = {};

      for (const error of this.errors) {
        const file = error.file || "General";
        if (!errorsByFile[file]) {
          errorsByFile[file] = [];
        }
        errorsByFile[file].push(error.message);
      }

      for (const [file, errors] of Object.entries(errorsByFile)) {
        console.log(`  📁 ${file}:`);
        for (const error of errors) {
          console.log(`    - ${error}`);
        }
        console.log("");
      }
    }

    // Group warnings by file
    if (this.warnings.length > 0) {
      console.log("WARNINGS:");
      const warningsByFile = {};

      for (const warning of this.warnings) {
        const file = warning.file || "General";
        if (!warningsByFile[file]) {
          warningsByFile[file] = [];
        }
        warningsByFile[file].push(warning.message);
      }

      for (const [file, warnings] of Object.entries(warningsByFile)) {
        console.log(`  📁 ${file}:`);
        for (const warning of warnings) {
          console.log(`    - ${warning}`);
        }
        console.log("");
      }
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(chalk.green(`✅ All validations passed!`));
    }

    // Write report to file
    const reportPath = path.join(process.cwd(), "validation-report-js.txt");
    const reportLines = [
      "JavaScript iCalendar Validation Report",
      "=".repeat(50),
      `Validation Date: ${new Date().toISOString()}`,
      `Files validated: ${this.validatedFiles}`,
      `Errors: ${this.errors.length}`,
      `Warnings: ${this.warnings.length}`,
      "",
    ];

    if (this.errors.length > 0) {
      reportLines.push("ERRORS:");
      for (const error of this.errors) {
        reportLines.push(`  - ${error.message}`);
      }
      reportLines.push("");
    }

    if (this.warnings.length > 0) {
      reportLines.push("WARNINGS:");
      for (const warning of this.warnings) {
        reportLines.push(`  - ${warning.message}`);
      }
      reportLines.push("");
    }

    fs.writeFileSync(reportPath, reportLines.join("\n"), "utf-8");
    console.log(`\nReport written to: ${reportPath}`);

    return this.errors.length === 0;
  }
}

// Main execution
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let basePath = "exampleSite";
  let showLog = false;

  for (const arg of args) {
    if (arg === "--showlog") {
      showLog = true;
    } else if (!arg.startsWith("--")) {
      basePath = arg;
    }
  }

  // Set log level based on --showlog flag
  if (showLog) {
    log.setLevel("info");
  } else {
    log.setLevel("error");
  }

  const siteTimezone = readSiteTimezone(basePath);

  console.log(
    chalk.blue(`Starting JavaScript iCalendar validation for: ${basePath}`),
  );
  if (siteTimezone) {
    console.log(chalk.blue(`Site timezone: ${siteTimezone}`));
  }

  const validator = new ICalValidatorJS(siteTimezone);
  const overallSuccess = await validator.validateAllFiles(basePath);
  const reportSuccess = validator.generateReport();

  const finalSuccess = overallSuccess && reportSuccess;

  if (finalSuccess) {
    console.log(chalk.green(`\n✅ Validation completed successfully!`));
    process.exit(0);
  } else {
    console.log(
      chalk.red(
        `\n❌ Validation failed with ${validator.errors.length} errors`,
      ),
    );
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error(chalk.red(`Fatal error: ${error.message}`));
  console.error(error.stack);
  process.exit(1);
});

export { ICalValidatorJS };

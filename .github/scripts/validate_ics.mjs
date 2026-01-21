#!/usr/bin/env node

/**
 * iCalendar Validation Script for Hugo iCalendar Templates (JavaScript/Node.js)
 * 
 * This script validates the generated .ics files using node-ical to ensure:
 * 1. Files are valid iCalendar format
 * 2. Cross-implementation compatibility with JavaScript parsers
 * 3. Correct recurrence rules and event properties
 * 4. Proper VALARM component handling
 * 
 * Usage:
 *     node validate_ics.mjs [base_path] [--showlog]
 * 
 * Where [base_path] is the root directory containing the Hugo site structure.
 * Default: exampleSite
 */

import fs from 'fs';
import path from 'path';
import ical from 'node-ical';
import yaml from 'js-yaml';
import chalk from 'chalk';
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

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
log.setDefaultLevel('error');

class ICalValidatorJS {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validatedFiles = 0;
    this.startTime = Date.now();
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
   * Parse YAML frontmatter from a markdown file
   */
  parseFrontmatter(mdPath) {
    try {
      const content = fs.readFileSync(mdPath, 'utf-8');

      // Extract frontmatter between --- markers
      if (content.startsWith('---\n')) {
        const endMarker = content.indexOf('\n---\n', 4);
        if (endMarker !== -1) {
          const frontmatter = content.substring(4, endMarker);
          return yaml.load(frontmatter) || {};
        }
      }
      return {};
    } catch (error) {
      this.logError(`Failed to parse frontmatter from ${mdPath}`, null, { error: error.message });
      return {};
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
        } else if (file.endsWith('.ics')) {
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

    if (filename === 'calendar.ics' || filename === 'calendar-alarms.ics') {
      const publicIndex = pathParts.indexOf('public');
      if (publicIndex !== -1 && publicIndex + 2 < pathParts.length) {
        const contentType = pathParts[publicIndex + 1];
        const contentName = pathParts[publicIndex + 2];
        const mdPath = path.join(basePath, 'content', contentType, `${contentName}.md`);

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

    if (filename === 'calendar.ics' || filename === 'calendar-alarms.ics') {
      const publicIndex = pathParts.indexOf('public');
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
      this.logError('No VCALENDAR component found', icsPath);
      return null;
    }

    const vcal = cal.vcalendar;

    if (!vcal.version) {
      this.logError('Missing VERSION property', icsPath);
    }

    if (!vcal.prodid) {
      this.logError('Missing PRODID property', icsPath);
    }

    // Find VEVENT components
    const events = Object.values(cal).filter(component => component.type === 'VEVENT');

    if (events.length === 0) {
      this.logError('No VEVENT components found', icsPath);
      return null;
    }

    return events;
  }

  /**
   * Validate event properties against frontmatter
   */
  validateEventProperties(event, frontmatter, icsPath) {
    this.logInfo(`Validating event properties for ${path.basename(icsPath)}`);

    // Check SUMMARY (title)
    if (frontmatter.title) {
      if (!event.summary) {
        this.logError('Missing SUMMARY property', icsPath);
      } else {
        // node-ical returns summary as an object with val property
        const summaryValue = typeof event.summary === 'object' && event.summary.val
          ? event.summary.val
          : event.summary;

        if (summaryValue !== frontmatter.title) {
          this.logError('SUMMARY doesn\'t match title', icsPath, {
            expected: frontmatter.title,
            actual: summaryValue
          });
        }
      }
    }

    // Check DTSTART
    if (frontmatter.startDate) {
      if (!event.start) {
        this.logError('Missing DTSTART property', icsPath);
      }
    }

    // Check DTEND
    if (frontmatter.endDate) {
      if (!event.end) {
        this.logError('Missing DTEND property', icsPath);
      }
    }

    // Check UID
    if (!event.uid) {
      this.logError('Missing UID property', icsPath);
    }

    // Check DTSTAMP
    if (!event.dtstamp) {
      this.logError('Missing DTSTAMP property', icsPath);
    }
  }

  /**
   * Validate RRULE component ordering
   */
  validateRruleComponentOrder(rruleStr, icsPath) {
    const expectedOrder = [
      'FREQ', 'UNTIL', 'COUNT', 'INTERVAL', 'BYSECOND', 'BYMINUTE', 'BYHOUR',
      'BYDAY', 'BYMONTHDAY', 'BYYEARDAY', 'BYWEEKNO', 'BYMONTH', 'BYSETPOS', 'WKST'
    ];

    const components = [];
    const parts = rruleStr.split(';');

    for (const part of parts) {
      if (part.includes('=')) {
        const component = part.split('=')[0].trim();
        components.push(component);
      }
    }

    let lastIndex = -1;
    for (const component of components) {
      if (expectedOrder.includes(component)) {
        const currentIndex = expectedOrder.indexOf(component);
        if (currentIndex < lastIndex) {
          this.logWarning(
            `RRULE component order violation: ${component} should come before previous components`,
            icsPath,
            { rrule: rruleStr }
          );
        }
        lastIndex = currentIndex;
      }
    }
  }

  /**
   * Validate recurrence rule against frontmatter
   */
  validateRecurrenceRule(event, frontmatter, icsPath) {
    if (!frontmatter.recurrenceRule) {
      return; // No recurrence rule expected
    }

    this.logInfo(`Validating recurrence rule for ${path.basename(icsPath)}`);

    if (!event.rrule) {
      this.logError('Expected RRULE but none found', icsPath);
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
        this.logError('FREQ mismatch', icsPath, {
          expected: expectedRule.freq,
          actual: actualFreq
        });
      }
    }

    // Validate INTERVAL (should always be present)
    const expectedInterval = expectedRule.interval || 1;
    const actualInterval = rruleOpts.interval;
    if (actualInterval === undefined || actualInterval !== expectedInterval) {
      this.logError('INTERVAL mismatch (INTERVAL is always required)', icsPath, {
        expected: expectedInterval,
        actual: actualInterval
      });
    }

    // Validate BYMONTH
    if (expectedRule.byMonth) {
      const expectedMonth = Array.isArray(expectedRule.byMonth)
        ? expectedRule.byMonth
        : [expectedRule.byMonth];
      const actualMonth = rruleOpts.bymonth || rruleOpts.byMonth;

      if (JSON.stringify(actualMonth) !== JSON.stringify(expectedMonth)) {
        this.logError('BYMONTH mismatch', icsPath, {
          expected: expectedMonth,
          actual: actualMonth
        });
      }
    }

    // Validate BYDAY (with ordinal format conversion)
    // node-ical uses 'byDay' (camelCase)
    if (expectedRule.byDay) {
      let expectedDay = Array.isArray(expectedRule.byDay)
        ? expectedRule.byDay
        : [expectedRule.byDay];

      const expectedSetpos = expectedRule.bySetPos;

      // Check if we should expect ordinal BYDAY format
      if (expectedSetpos !== undefined && expectedDay.length === 1) {
        const setposList = Array.isArray(expectedSetpos) ? expectedSetpos : [expectedSetpos];

        if (setposList.length === 1) {
          // Should be converted to ordinal format like "3TH"
          expectedDay = [`${setposList[0]}${expectedDay[0]}`];
        }
      }

      const actualDay = rruleOpts.byDay || rruleOpts.byday;

      if (JSON.stringify(actualDay) !== JSON.stringify(expectedDay)) {
        this.logError('BYDAY mismatch', icsPath, {
          expected: expectedDay,
          actual: actualDay
        });
      }
    }

    // Validate BYSETPOS (should be absent if converted to ordinal BYDAY)
    if (expectedRule.bySetPos !== undefined) {
      const expectedDay = expectedRule.byDay;
      const expectedSetpos = expectedRule.bySetPos;

      if (expectedDay !== undefined) {
        const dayList = Array.isArray(expectedDay) ? expectedDay : [expectedDay];
        const setposList = Array.isArray(expectedSetpos) ? expectedSetpos : [expectedSetpos];

        // If single day and single setpos, should be converted to ordinal format
        if (dayList.length === 1 && setposList.length === 1) {
          const actualSetpos = rruleOpts.bysetpos || rruleOpts.bySetPos;
          if (actualSetpos !== undefined) {
            this.logError(
              'BYSETPOS should be absent (converted to ordinal BYDAY format)',
              icsPath,
              {
                expected: null,
                actual: actualSetpos,
                convertedToOrdinal: `${setposList[0]}${dayList[0]}`
              }
            );
          }
        }
      }
    }

    // Validate component ordering using the original RRULE string from the file
    const icsContent = fs.readFileSync(icsPath, 'utf-8');
    const rruleMatch = icsContent.match(/RRULE:([^\r\n]+)/);
    if (rruleMatch) {
      const rruleStr = rruleMatch[1];
      this.validateRruleComponentOrder(rruleStr, icsPath);
    }
  }

  /**
   * Validate VALARM components
   */
  validateValarmComponents(event, frontmatter, icsPath) {
    const isAlarmsFile = icsPath.includes('calendar-alarms.ics');

    // node-ical doesn't parse VALARM components directly in the event object
    // We need to check the raw iCalendar data
    const icsContent = fs.readFileSync(icsPath, 'utf-8');
    const hasValarm = icsContent.includes('BEGIN:VALARM');

    if (!frontmatter.alarms) {
      if (hasValarm) {
        this.logError('Unexpected VALARM components found', icsPath);
      }
      return;
    }

    this.logInfo(`Validating VALARM components for ${path.basename(icsPath)}`);

    const expectedAlarms = frontmatter.alarms;

    if (isAlarmsFile) {
      if (!hasValarm) {
        this.logError('Expected VALARM components but none found in alarms file', icsPath, {
          expected: expectedAlarms.length,
          actual: 0
        });
      }
    } else {
      // Regular calendar.ics files should NOT contain VALARM
      if (hasValarm) {
        this.logError('Regular calendar file should not contain VALARM components', icsPath);
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
      this.logError(`Failed to parse file: ${error.message}`, icsPath, { error: error.stack });
      return false;
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
        this.logError('No VCALENDAR component found in category calendar', icsPath);
        return false;
      }

      const vcal = cal.vcalendar;

      if (!vcal.version) {
        this.logError('Missing VERSION property in category calendar', icsPath);
      }

      if (!vcal.prodid) {
        this.logError('Missing PRODID property in category calendar', icsPath);
      }

      // Find all VEVENT components
      const events = Object.values(cal).filter(component => component.type === 'VEVENT');

      if (events.length === 0) {
        this.logWarning('No VEVENT components found in category calendar', icsPath);
        return true;
      }

      this.logInfo(`Found ${events.length} events in category calendar`, { file: icsPath });

      // Validate each event's basic structure
      for (const event of events) {
        const eventSummary = event.summary || 'Unknown Event';

        if (!event.uid) {
          this.logError(`Event '${eventSummary}' missing UID in category calendar`, icsPath);
        }

        if (!event.start) {
          this.logError(`Event '${eventSummary}' missing DTSTART in category calendar`, icsPath);
        }

        if (!event.dtstamp) {
          this.logError(`Event '${eventSummary}' missing DTSTAMP in category calendar`, icsPath);
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
              icsPath
            );
          }
        }
      }

      this.validatedFiles++;
      return true;
    } catch (error) {
      this.logError(`Failed to parse category calendar: ${error.message}`, icsPath, { error: error.stack });
      return false;
    }
  }

  /**
   * Validate all .ics files in the base path
   */
  async validateAllFiles(basePath) {
    const startTime = Date.now();
    console.log(chalk.blue(`\nStarting JavaScript iCalendar validation for: ${basePath}\n`));

    const publicDir = path.join(basePath, 'public');

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

    this.logInfo(`Categorized files: ${individualCalendars.length} individual, ${categoryCalendars.length} category`);

    let success = true;

    // Validate individual event calendars
    console.log(chalk.cyan(`\nValidating individual event calendars...`));
    for (const icsFile of individualCalendars.sort()) {
      const mdFile = this.findCorrespondingMarkdown(icsFile, basePath);
      if (!await this.validateIcsFile(icsFile, mdFile)) {
        success = false;
      }
    }

    // Validate category calendars
    console.log(chalk.cyan(`\nValidating category calendars...`));
    for (const icsFile of categoryCalendars.sort()) {
      if (!await this.validateCategoryCalendar(icsFile)) {
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
    console.log(`\n${'='.repeat(50)}`);
    console.log('JavaScript iCalendar Validation Report');
    console.log('='.repeat(50));
    console.log(`Validation Date: ${new Date().toISOString()}`);
    console.log(`Files validated: ${this.validatedFiles}`);
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log('');

    // Statistics
    if (this.validatedFiles > 0) {
      const errorRate = ((this.errors.length / this.validatedFiles) * 100).toFixed(1);
      const warningRate = ((this.warnings.length / this.validatedFiles) * 100).toFixed(1);
      console.log('STATISTICS:');
      console.log(`  Error rate: ${errorRate}%`);
      console.log(`  Warning rate: ${warningRate}%`);
      console.log('');
    }

    // Group errors by file
    if (this.errors.length > 0) {
      console.log('ERRORS:');
      const errorsByFile = {};

      for (const error of this.errors) {
        const file = error.file || 'General';
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
        console.log('');
      }
    }

    // Group warnings by file
    if (this.warnings.length > 0) {
      console.log('WARNINGS:');
      const warningsByFile = {};

      for (const warning of this.warnings) {
        const file = warning.file || 'General';
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
        console.log('');
      }
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(chalk.green(`✅ All validations passed!`));
    }

    // Write report to file
    const reportPath = path.join(process.cwd(), 'validation-report-js.txt');
    const reportLines = [
      'JavaScript iCalendar Validation Report',
      '='.repeat(50),
      `Validation Date: ${new Date().toISOString()}`,
      `Files validated: ${this.validatedFiles}`,
      `Errors: ${this.errors.length}`,
      `Warnings: ${this.warnings.length}`,
      ''
    ];

    if (this.errors.length > 0) {
      reportLines.push('ERRORS:');
      for (const error of this.errors) {
        reportLines.push(`  - ${error.message}`);
      }
      reportLines.push('');
    }

    if (this.warnings.length > 0) {
      reportLines.push('WARNINGS:');
      for (const warning of this.warnings) {
        reportLines.push(`  - ${warning.message}`);
      }
      reportLines.push('');
    }

    fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf-8');
    console.log(`\nReport written to: ${reportPath}`);

    return this.errors.length === 0;
  }
}

// Main execution
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let basePath = 'exampleSite';
  let showLog = false;

  for (const arg of args) {
    if (arg === '--showlog') {
      showLog = true;
    } else if (!arg.startsWith('--')) {
      basePath = arg;
    }
  }

  // Set log level based on --showlog flag
  if (showLog) {
    log.setLevel('info');
  } else {
    log.setLevel('error');
  }

  console.log(chalk.blue(`Starting JavaScript iCalendar validation for: ${basePath}`));

  const validator = new ICalValidatorJS();
  const overallSuccess = await validator.validateAllFiles(basePath);
  const reportSuccess = validator.generateReport();

  const finalSuccess = overallSuccess && reportSuccess;

  if (finalSuccess) {
    console.log(chalk.green(`\n✅ Validation completed successfully!`));
    process.exit(0);
  } else {
    console.log(chalk.red(`\n❌ Validation failed with ${validator.errors.length} errors`));
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error(chalk.red(`Fatal error: ${error.message}`));
  console.error(error.stack);
  process.exit(1);
});

export { ICalValidatorJS };

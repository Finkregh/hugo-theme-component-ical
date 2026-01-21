test:  hugo_go_modules build_hugo run_ics_validation_dual
    @echo "Running all tests with dual validation..."

test_debug:  hugo_go_modules build_hugo_debug run_ics_validation_dual
    @echo "Running debug with dual validation..."

test_python:  hugo_go_modules build_hugo run_ics_validation_python
    @echo "Running tests with Python validation only..."

test_js:  hugo_go_modules build_hugo run_ics_validation_js
    @echo "Running tests with JavaScript validation only..."

test_showlog:  hugo_go_modules build_hugo run_ics_validation_dual_showlog
    @echo "Running all tests with dual validation (with logs)..."

test_python_showlog:  hugo_go_modules build_hugo run_ics_validation_python_showlog
    @echo "Running tests with Python validation only (with logs)..."

test_js_showlog:  hugo_go_modules build_hugo run_ics_validation_js_showlog
    @echo "Running tests with JavaScript validation only (with logs)..."

[working-directory: '.github/exampleSite']
localserve:  hugo_go_modules
    @echo "Starting Hugo local server with TLS..."
    hugo server --source . --noHTTPCache --disableFastRender --gc --tlsAuto -D -e development

[working-directory: '.github/exampleSite']
hugo_go_modules:
    hugo mod get -u ./...
    hugo mod tidy
    rm -rf _vendor || true
    hugo mod vendor
    hugo mod npm pack
    npm install

[working-directory: '.github/exampleSite']
build_hugo:
    hugo build --quiet --cleanDestinationDir --baseURL https://finkregh.github.io/hugo-theme-component-ical/pr-preview/pr-${PR_NUMBER}

[working-directory: '.github/exampleSite']
build_hugo_debug:
    hugo build --cleanDestinationDir --printPathWarnings --printI18nWarnings --logLevel debug --buildDrafts --environment development --baseURL https://finkregh.github.io/hugo-theme-component-ical/

[working-directory: '.github/exampleSite']
build_hugo_debug_verbose:
    hugo build --cleanDestinationDir --printPathWarnings --printUnusedTemplates --printI18nWarnings --logLevel debug --buildDrafts --templateMetrics --templateMetricsHints --environment development --baseURL https://finkregh.github.io/hugo-theme-component-ical/

[working-directory: '.github/exampleSite']
build_hugo_localhost:
    hugo build --cleanDestinationDir --printPathWarnings --printUnusedTemplates --printI18nWarnings --logLevel debug --buildDrafts --templateMetrics --templateMetricsHints --environment development --baseURL https://localhost:4443/

[working-directory: '.github']
run_ics_validation_python:
    @echo "Running Python iCal validation..."
    uv pip install -r scripts/requirements.txt
    python3 scripts/validate_ics.py

[working-directory: '.github']
run_ics_validation_python_showlog:
    @echo "Running Python iCal validation (with logs)..."
    uv pip install -r scripts/requirements.txt
    python3 scripts/validate_ics.py --showlog

[working-directory: '.github']
run_ics_validation_js:
    @echo "Running JavaScript iCal validation..."
    npm i --include=dev
    node scripts/validate_ics.mjs

[working-directory: '.github']
run_ics_validation_js_showlog:
    @echo "Running JavaScript iCal validation (with logs)..."
    npm i --include=dev
    node scripts/validate_ics.mjs --showlog

[working-directory: '.github']
run_ics_validation_dual: run_ics_validation_python run_ics_validation_js
    @echo "Running dual validation (Python + JavaScript)..."

[working-directory: '.github']
run_ics_validation_dual_showlog: run_ics_validation_python_showlog run_ics_validation_js_showlog
    @echo "Running dual validation (Python + JavaScript) with logs..."

# Legacy alias for backward compatibility
[working-directory: '.github']
run_ics_validation: run_ics_validation_dual

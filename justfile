test:  hugo_go_modules build_hugo run_ics_validation
    @echo "Running all tests..."

test_debug:  hugo_go_modules build_hugo_debug run_ics_validation
    @echo "Running debug..."

localserve_build:  hugo_go_modules build_hugo_localhost
    @echo "Starting local server at https://localhost:4443"
    python3 server.py

[working-directory: '.github/exampleSite']
hugo_go_modules:
    hugo mod get ./...
    hugo mod tidy
    hugo mod npm pack
    npm update

[working-directory: '.github/exampleSite']
build_hugo:
    hugo build --quiet --cleanDestinationDir --baseURL https://finkregh.github.io/hugo-theme-component-ical/pr-preview/pr-${PR_NUMBER}

[working-directory: '.github/exampleSite']
build_hugo_debug:
    hugo build --cleanDestinationDir --printPathWarnings --printUnusedTemplates --printI18nWarnings --logLevel debug --buildDrafts --templateMetrics --templateMetricsHints --environment testing --baseURL https://finkregh.github.io/hugo-theme-component-ical/

[working-directory: '.github/exampleSite']
build_hugo_localhost:
    hugo build --cleanDestinationDir --printPathWarnings --printUnusedTemplates --printI18nWarnings --logLevel debug --buildDrafts --templateMetrics --templateMetricsHints --environment testing --baseURL https://localhost:4443/

[working-directory: '.github']
run_ics_validation: build_hugo
    # source .venv/bin/activate
    uv pip install -r scripts/requirements.txt
    python3 scripts/validate_ics.py

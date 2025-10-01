test:  hugo_go_modules build_hugo run_ics_validation
    @echo "Running all tests..."

test_debug:  hugo_go_modules build_hugo_debug run_ics_validation
    @echo "Running debug..."

[working-directory: '.github/exampleSite']
hugo_go_modules:
    hugo mod get -u ./...
    hugo mod tidy

[working-directory: '.github/exampleSite']
build_hugo:
    hugo build --quiet --cleanDestinationDir

[working-directory: '.github/exampleSite']
build_hugo_debug:
    hugo build --logLevel debug --cleanDestinationDir

[working-directory: '.github']
run_ics_validation: build_hugo
    # source .venv/bin/activate
    uv pip install -r scripts/requirements.txt
    python3 scripts/validate_ics.py

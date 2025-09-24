test:  build_hugo run_ics_validation
    @echo "Running all tests..."

test_debug:  build_hugo_debug run_ics_validation
    @echo "Running debug..."

[working-directory: 'demo']
build_hugo:
    hugo build --quiet

[working-directory: 'demo']
build_hugo_debug:
    hugo build --logLevel debug

run_ics_validation: build_hugo
    # source .venv/bin/activate
    uv pip install -r scripts/requirements.txt
    python3 scripts/validate_ics.py

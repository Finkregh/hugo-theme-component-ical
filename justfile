test: sync_partials build_hugo run_ics_validation
    @echo "Running all tests..."

test_debug: sync_partials build_hugo_debug run_ics_validation
    @echo "Running debug..."

sync_partials:
    rsync -av --delete src/layouts/* demo/layouts/

[working-directory: 'demo']
build_hugo: sync_partials
    hugo build --quiet

[working-directory: 'demo']
build_hugo_debug: sync_partials
    hugo build --logLevel debug

run_ics_validation: build_hugo
    # source .venv/bin/activate
    uv pip install -r scripts/requirements.txt
    python3 scripts/validate_ics.py

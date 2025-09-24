test: sync_partials build_hugo run_ics_validation
    @echo "Running all tests..."

[working-directory: 'demo']
sync_partials:
    rsync -av ../src/layouts/partials/* layouts/partials/

[working-directory: 'demo']
build_hugo: sync_partials
    hugo build --quiet

run_ics_validation: build_hugo
    source .venv/bin/activate
    uv pip install -r scripts/requirements.txt
    python3 scripts/validate_ics.py

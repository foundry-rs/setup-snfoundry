# Install SnFoundry

Sets up [SnFoundry] in your GitHub Actions workflow supporting caching out of the box.

## Example workflow

```yaml
name: My workflow
on:
  push:
  pull_request:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: foundry-rs/setup-snfoundry@v1
        with:
          starnet-foundry-version: "0.6.0"
      - run: snforge
```

## Inputs

- `starknet-foundry-version` - **Optional**. String:
  - Stating an explicit SnFoundry version to use, for example `"0.6.0"`.

## Outputs

- `starknet-foundry-prefix` - A path to where Starknet Foundry has been extracted to. The `snforge`and `sncast` binaries will be located in the `bin`
  subdirectory (`${{ steps.setup-starknet-foundry.outputs.starknet-foundry-prefix }}/bin`).
- `starknet-foundry-version` - Installed SnForge version (as reported by `snforge -V`).

[SnFoundry]: https://foundry-rs.github.io/starknet-foundry

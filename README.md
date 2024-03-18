# Install Starknet Foundry

Sets up [Starknet Foundry] in your GitHub Actions workflow supporting caching out of the box.

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
      - uses: foundry-rs/setup-snfoundry@v3
      - run: snforge
```

## Inputs

- `starknet-foundry-version` - **Optional**. String:

  - Stating an explicit Starknet Foundry version to use, for example `"0.9.1"`.
  - Empty/not specified: the .tool-versions file will be read to resolve starknet foundry version, and in case it is not present the latest stable version will be used.

- `tool-versions` - Optional. String.
  - Stating a relative or absolute path to the .tool-versions file.
  - Should be used only if starknet-foundry-version is not specified.

## Outputs

- `starknet-foundry-prefix` - A path to where Starknet Foundry has been extracted to. The `snforge`and `sncast` binaries will be located in the `bin`
  subdirectory (`${{ steps.setup-starknet-foundry.outputs.starknet-foundry-prefix }}/bin`).
- `starknet-foundry-version` - Version of Starknet Foundry that was installed (as reported by `snforge -V`).

[Starknet Foundry]: https://foundry-rs.github.io/starknet-foundry

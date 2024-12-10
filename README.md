# Install Starknet Foundry

Sets up [Starknet Foundry] in your GitHub Actions workflow supporting caching out of the box.


> 📝 **Note**
> At this moment, only Linux and MacOS are supported.

## Example workflow

Make sure you pass the valid path to `Scarb.lock` to [setup-scarb](https://github.com/marketplace/actions/setup-scarb) action. This way, all dependencies including snforge_scarb_plugin will be cached between runs.

```yaml
name: My workflow
on:
  push:
  pull_request:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Starknet Foundry
        uses: foundry-rs/setup-snfoundry@v3

      - name: Setup Scarb
        uses: software-mansion/setup-scarb@v1
        with:
          scarb-lock: ./hello_starknet/Scarb.lock

      - name: Run tests
        run: cd hello_starknet && snforge test
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

For more information, visit [Starknet Foundry docs section](https://foundry-rs.github.io/starknet-foundry/testing/running-tests.html) dedicated to CI setup.

[Starknet Foundry]: https://foundry-rs.github.io/starknet-foundry

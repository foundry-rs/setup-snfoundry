# Building and Contributing Guide

To contribute to this project, feel free to open a PR introducing your changes.

Make sure that your PR is properly formatted. It can be automatically done with `npm run fmt`.

Make sure that you've run `npm run build` command and committed any changes introduced in `dist` directory.
This step is necessary for your changes to actually be used in the action.

## Updating or Creating Version Tag

In readme, we recommend using the workflow by specifying its version
as `@vVERSION` (`@v1` as of writing of this document).

For this syntax to work, a tag with the same name must be present in the repository.

In case new versions of this workflow are published either an existing tag has to be updated or a new one created
accordingly.

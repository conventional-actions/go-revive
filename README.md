# go-revive

A GitHub Action for running [revive](https://revive.run/).

## Usage

To use the GitHub Action, add the following to your job:

```yaml
- uses: conventional-actions/go-revive@v1
```

### Inputs

| Name           | Default          | Description                              |
|----------------|------------------|------------------------------------------|
| `version`      | `latest`         | the version of revive to install         |
| `config_path`  | `./revive.toml`  | path to config file in TOML format       |
| `exclude_path` | N/A              | paths to exclude                         |
| `format`       | `sarif`          | formatter to be used for the output      |
| `output_path`  | `gorevive.sarif` | the output path to write the SARIF file  |
| `package`      | `./...`          | the package to scan                      |

### Outputs

| Name          | Type     | Description      |
|---------------|----------|------------------|
| `output_path` | `string` | output file path |

### Example

```yaml
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - id: gorevive
        uses: conventional-actions/go-revive@v1
      - uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: ${{steps.gorevive.outputs.output_path}}
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).


import * as core from '@actions/core'
import {parseMultiInput} from '@conventional-actions/toolkit'

type Config = {
  github_token: string
  version: string
  configPath: string
  outputPath: string
  packages: string[]
  excludePaths: string[]
  format: string
}

export async function getConfig(): Promise<Config> {
  return {
    github_token: process.env['GITHUB_TOKEN'] || '',
    version: core.getInput('version') || 'latest',
    configPath: core.getInput('config_path') || './revive.toml',
    outputPath: core.getInput('output_path') || 'gorevive.sarif',
    packages: parseMultiInput(core.getInput('package') || './...'),
    excludePaths: parseMultiInput(core.getInput('exclude_path') || ''),
    format: core.getInput('format') || 'sarif'
  }
}

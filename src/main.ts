import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {parseInputFiles} from './utils'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    const configPath = core.getInput('config_path') || './revive.toml'
    const outputPath = core.getInput('output_path') || 'gorevive.sarif'
    const packages = parseInputFiles(core.getInput('package') || './...')
    const excludePaths = parseInputFiles(core.getInput('exclude_path') || '')
    const format = core.getInput('format') || 'sarif'

    let args: string[] = [
      '-config',
      configPath,
      '-format',
      format,
      '-set_exit_status'
    ]
    for (const excludePath of excludePaths) {
      args = args.concat('-exclude', excludePath)
    }

    for (const pkg of packages) {
      const output = await exec.getExecOutput('revive', args.concat(pkg))
      fs.writeFileSync(outputPath, output.stdout)
      core.setOutput('output_path', outputPath)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

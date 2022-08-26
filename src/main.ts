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

    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(
        configPath,
        `
ignoreGeneratedHeader = false
severity = "warning"
confidence = 0.8
errorCode = 0
warningCode = 0

[rule.blank-imports]
[rule.context-as-argument]
[rule.context-keys-type]
[rule.dot-imports]
[rule.error-return]
[rule.error-strings]
[rule.error-naming]
[rule.exported]
[rule.if-return]
[rule.increment-decrement]
[rule.var-naming]
[rule.var-declaration]
[rule.package-comments]
[rule.range]
[rule.receiver-naming]
[rule.time-naming]
[rule.unexported-return]
[rule.indent-error-flow]
[rule.errorf]
[rule.empty-block]
[rule.superfluous-else]
[rule.unused-parameter]
[rule.unreachable-code]
[rule.redefines-builtin-id]
`
      )
    }

    let args: string[] = [
      '-config',
      configPath,
      '-formatter',
      format
      // '-set_exit_status'
    ]
    for (const excludePath of excludePaths) {
      args = args.concat('-exclude', excludePath)
    }

    for (const pkg of packages) {
      const output = await exec.getExecOutput('revive', args.concat(pkg), {
        silent: true
      })
      fs.writeFileSync(outputPath, output.stdout)
      core.setOutput('output_path', outputPath)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

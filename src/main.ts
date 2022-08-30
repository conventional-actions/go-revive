import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import {getConfig} from './config'

async function run(): Promise<void> {
  try {
    const config = await getConfig()

    if (!fs.existsSync(config.configPath)) {
      fs.writeFileSync(
        config.configPath,
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
      config.configPath,
      '-formatter',
      config.format
      // '-set_exit_status'
    ]
    for (const excludePath of config.excludePaths) {
      args = args.concat('-exclude', excludePath)
    }

    for (const pkg of config.packages) {
      const output = await exec.getExecOutput('revive', args.concat(pkg), {
        silent: true
      })
      fs.writeFileSync(config.outputPath, output.stdout)
      core.setOutput('output_path', config.outputPath)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

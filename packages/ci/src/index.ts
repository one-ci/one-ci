import program from 'commander'
import { version } from '../package.json'
import { deploy } from './commands/deploy'
import { doctor } from './commands/doctor'

program.version(version).description('one ci for one')

program.command('deploy').description('发布小程序').action(deploy)

program.command('doctor').description('检查项目配置').action(doctor)

program.on('command:*', function () {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  )
  process.exit(1)
})
program.on('option:*', function () {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  )
  process.exit(1)
})

program.parse(process.argv)

const NO_COMMAND_SPECIFIED = program.args.length === 0

if (NO_COMMAND_SPECIFIED) {
  program.help()
}

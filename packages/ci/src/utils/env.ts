import { desc, env, envDescMap, version } from '../constans/env'
import { Env } from '../interface/env'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import ora from 'ora'
import { CWD } from '../constans/cwd'

export function getEnv(): {
  env: Env
  desc: string
  version: string
} {
  return {
    env,
    desc: desc + envDescMap[env],
    version: version || getPackageVersion()!,
  }
}
function getPackageVersion(): string | undefined {
  const filePath = path.resolve(CWD, 'package.json')
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(
        fs.readFileSync(filePath, {
          encoding: 'utf-8',
        })
      ).version
    } catch (error) {}
  }
}
export function checkEnv() {
  const data = getEnv()
  const loading = ora({
    text: chalk.green('检查环境\n'),
    prefixText: chalk.yellow('@one-ci/ci doctor'),
  })
  if (!data.env) {
    loading.fail(
      chalk.red('检查环境失败') +
        chalk.white(' 请传递环境变量 ') +
        chalk.green(' RELEASE_ENV ') +
        chalk.green(' eg export RELEASE_ENV=xxx ')
    )
    return false
  } else if (data.env === Env.Prod && !data.version) {
    loading.fail(
      chalk.red('检查环境失败') +
        chalk.white(' 请传递环境变量 ') +
        chalk.green(' RELEASE_VERSION ') +
        chalk.green(' eg export RELEASE_VERSION=xxx ') +
        chalk.white(' 或者声明 package.json version 字段 ')
    )
    return false
  }
  loading.succeed('检查环境成功')
  return true
}

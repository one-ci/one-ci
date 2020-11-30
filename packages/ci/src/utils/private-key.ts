import { privateKeyPath } from '../constans/private-key'
import chalk from 'chalk'
import fs from 'fs'
import ora from 'ora'
/**
 * 生成临时privateKey
 **/
export function genPrivateKey() {
  if (process.env.PRIVATE_KEY) {
    try {
      fs.writeFileSync(privateKeyPath, process.env.PRIVATE_KEY)
      return true
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
/**
 * 检查临时privateKey
 **/
export function checkPrivateKey() {
  const loading = ora({
    text: chalk.green('生成临时privateKey\n'),
    prefixText: chalk.yellow('@one-ci/ci doctor'),
  })
  const hasGenPrivateKey = genPrivateKey()
  if (!hasGenPrivateKey) {
    loading.fail(
      chalk.red('生成临时privateKey 失败') +
        chalk.white(' 请配置') +
        chalk.green(' PRIVATE_KEY ') +
        chalk.white('环境变量') +
        chalk.green(' eg export PRIVATE_KEY= xxx ')
    )
    return false
  }
  loading.succeed(chalk.green('生成临时privateKey 成功'))
  return true
}
/**
 * 删除临时privateKey
 */
export function removePrivateKey() {
  fs.rmSync(privateKeyPath)
}

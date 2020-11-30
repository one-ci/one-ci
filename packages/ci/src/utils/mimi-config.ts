import { miniProgramConfigPath } from '../constans/project'
import { MiniProgramCompileSetting, MiniProgramConfig } from '../interface/config'
import chalk from 'chalk'
import fs from 'fs'
import ora from 'ora'

let userConfig: MiniProgramConfig | null = null

export function getMiniConfig(force = false): MiniProgramConfig {
  if (force || userConfig === null) {
    const file = fs.readFileSync(miniProgramConfigPath, {
      encoding: 'utf-8',
    })
    userConfig = JSON.parse(file) as MiniProgramConfig
    return userConfig
  }
  return userConfig
}
export function checkMiniConfig() {
  const loading = ora({
    text: chalk.green('检查小程序配置\n'),
    prefixText: chalk.yellow('@one-ci/ci doctor'),
  })
  const hasConfig = fs.existsSync(miniProgramConfigPath)
  if (!hasConfig) {
    loading.fail(
      chalk.red('检查小程序配置 失败 ') +
        chalk.green.underline(miniProgramConfigPath) +
        chalk.red(' 不存在 ')
    )
    return false
  }
  const config = getMiniConfig()
  if (config === null) {
    loading.fail(
      chalk.red('检查小程序配置 失败') +
        chalk.white(' 请检查') +
        chalk.green(' 检查小程序配置文件 ')
    )
    return false
  }
  loading.succeed(chalk.green('检查小程序配置 成功'))
  return true
}
/**
 * postcss -> autoPrefixWXSS
 * uglifyFileName -> codeProtect
 * es6 -> es6
 * enhance -> es7
 * minified -> minify
 */
export function transformSetting(
  settings: MiniProgramCompileSetting = {}
): MiniProgramCI.ICompileSettings {
  return {
    es6: settings.es6,
    es7: settings.enhance,
    minify: settings.minified,
    codeProtect: settings.uglifyFileName,
    autoPrefixWXSS: settings.postcss,
  }
}

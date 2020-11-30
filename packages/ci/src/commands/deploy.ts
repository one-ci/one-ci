import ci from 'miniprogram-ci'
import { getEnv } from '../utils/env'
import { getMiniConfig, transformSetting } from '../utils/mimi-config'
import { doctor } from './doctor'
import { envFnMap } from '../constans/env'
import { CWD } from '../constans/cwd'
import { privateKeyPath } from '../constans/private-key'

import chalk from 'chalk'

export async function deploy() {
  doctor()
  const miniConfig = getMiniConfig()
  const env = getEnv()
  const compileSettings = transformSetting(miniConfig.setting)
  const project = new ci.Project({
    projectPath: CWD,
    privateKeyPath: privateKeyPath,
    appid: miniConfig.appid,
    type: 'miniProgram',
  })
  const fn = envFnMap[env.env]
  console.log(chalk.green`开始发布`)
  try {
    const res = await fn({
      project,
      ...env,
      setting: compileSettings,
      qrcodeFormat: 'terminal',
      qrcodeOutputDest: '',
    })
    console.info(res)
    console.log(chalk.green`发布成功`)
  } catch (error) {
    console.log(chalk.red`发布失败`)
    console.error(error)
    process.exit(-1)
  }
}

// 检查环境
// 检查key
// 环境为prod的时候检查version + desc

import { checkEnv } from '../utils/env'
import { checkMiniConfig } from '../utils/mimi-config'
import { checkPrivateKey } from '../utils/private-key'

export function checkConfig(): boolean {
  for (const fn of [checkMiniConfig, checkEnv, checkPrivateKey]) {
    if (!fn()) {
      return false
    }
  }
  return true
}

export function doctor(): void {
  if (!checkConfig()) {
    process.exit(1)
  }
}

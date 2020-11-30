import { preview, upload } from 'miniprogram-ci'
import { Env } from '../interface/env'
export const env: Env = process.env.RELEASE_ENV as Env
export const envDescMap: Record<Env, string> = {
  [Env.Prod]: '正式环境',
  [Env.Dev]: '测试环境',
}
export const envFnMap: Record<Env, typeof preview | typeof upload> = {
  [Env.Dev]: preview,
  [Env.Prod]: upload,
}
export const version = process.env.RELEASE_VERSION
export const desc = process.env.RELEASE_DESC

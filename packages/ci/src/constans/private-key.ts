import path from 'path'
import { CWD } from './cwd'

export const privateKeyName = '.__private.Key'
export const privateKeyPath = path.resolve(CWD, privateKeyName)

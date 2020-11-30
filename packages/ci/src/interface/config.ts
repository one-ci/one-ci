export interface MiniProgramConfig {
  appid: string
  setting?: MiniProgramCompileSetting
}
export interface MiniProgramCompileSetting {
  es6?: boolean
  postcss?: boolean
  minified?: boolean
  enhance?: boolean
  uglifyFileName?: boolean
  [key: string]: any
}
export type Robot =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
export interface Config {
  robot?: Robot
  before?: {
    run: string
  }
  after?: {
    run: string
  }
}
export interface CliConfig {
  dev?: Config
  prod?: Config
}

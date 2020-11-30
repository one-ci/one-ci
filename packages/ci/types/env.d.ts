declare global {
  namespace NodeJS {
    interface ProcessEnv extends Dict<string> {
      /**
       * 发布环境
       */
      RELEASE_ENV: 'prod' | 'dev'
      /**
       * ci 上传代码key
       */
      PRIVATE_KEY: string
      /**
       * 发布版本
       * 正式环境必须 package.json version or 环境变量
       */
      RELEASE_VERSION?: string
      /**
       * 发布描述
       */
      RELEASE_DESC: string
    }
  }
}
export {}

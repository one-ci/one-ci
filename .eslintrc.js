const { getEslint } = require('@one-style/eslint')

module.exports = {
  ...getEslint({ useTs: true, useReact: true, ignorePatterns: ['*.json'] }),
}

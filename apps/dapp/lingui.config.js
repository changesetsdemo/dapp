module.exports = {
  catalogs: [
    {
      path: '<rootDir>/src/web/locales/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  compileNamespace: 'cjs',
  // extractBabelOptions: {},
  fallbackLocales: {
    default: 'en-US',
  },
  format: 'minimal',
  formatOptions: { origins: false, lineNumbers: false },
  sourceLocale: 'en-US',
  locales: ['en-US', 'zh-TW'],
  orderBy: 'messageId',
  pseudoLocale: 'pseudo',
  rootDir: '.',
  runtimeConfigModule: {
    i18n: ['@lingui/core', 'i18n'],
    Trans: ['@lingui/react', 'Trans'],
  },
};

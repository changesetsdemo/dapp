const withTM = require('next-transpile-modules')(['@changesetsdemo/ui']);

module.exports = withTM({
  reactStrictMode: true,
});

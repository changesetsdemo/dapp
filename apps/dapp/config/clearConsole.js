const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const core = require('@babel/core');
module.exports = function (source) {
  const ast = parse(source, {
    sourceType: 'unambiguous',
    strictMode: false,
    plugins: ['typescript', 'jsx', 'dynamicImport'],
  });

  traverse(ast, {
    CallExpression(path) {
      const memberExpression = path.node.callee;
      if (memberExpression.object && memberExpression.object.name === 'console') {
        path.remove();
      }
    },
  });

  const { code } = core.transformFromAst(ast);
  return Buffer.from(code);
};

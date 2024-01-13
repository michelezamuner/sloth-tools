const { stmt } = require('fion');
const { parse } = require('./parser');

exports.parse = (line, ctx = []) => {
  // @todo: use a better check
  if (line.indexOf('fun main') === -1) {
    line = `fun main ${line}`;
  }
  const ast = parse(line);
  const main = ast.funs.find(({ name }) => name === 'main');
  const newCtx = main.stmts.filter(({ type }) => type === stmt.DEC);
  main.stmts.unshift(...ctx);

  return { ast: ast, ctx: [...ctx, ...newCtx] };
};

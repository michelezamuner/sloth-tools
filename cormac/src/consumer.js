const { stmt } = require('fion');

exports.consume = (ast, ctx = []) => {
  const main = ast.funs.find(({ name }) => name === 'main');
  const newCtx = main.stmts.filter(({ type }) => type === stmt.DEC);
  main.stmts.unshift(...ctx);

  return { ast: ast, ctx: [...ctx, ...newCtx] };
};

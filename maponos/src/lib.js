const expr = require('./expr');
const { code } = require('fedelm');

exports.compile = ast => {
  const exprCode = expr.compile(ast.funs[0].stmts[0].expr);

  return Buffer.concat([exprCode, Buffer.from([code('exit'), code('a')])]);
};

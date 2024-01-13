const { parse } = require('fedelm');

const Stmt = require('./stmt');

exports.compile = ast => {
  const elems = [];
  for (const s of ast.funs[0].stmts) {
    elems.push(Stmt.compile(s));
  }

  elems.push(parse(`
    pop a
    exit a
  `));

  return Buffer.concat(elems);
};

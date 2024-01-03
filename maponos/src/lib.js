const { parse } = require('fedelm');
const stmt = require('./stmt');

exports.compile = ast => {
  const elems = [];
  for (const s of ast.funs[0].stmts) {
    elems.push(stmt.compile(s));
  }

  elems.push(parse(`
    pop a
    exit a
  `));

  return Buffer.concat(elems);
};

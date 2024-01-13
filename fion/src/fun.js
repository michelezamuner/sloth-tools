const Stmt = require('./stmt');

exports.create = ([name, stmts]) => {
  if (typeof name !== 'string') {
    throw `Invalid function: first element must be function name, found '${JSON.stringify(name)}'`;
  }

  if (!Array.isArray(stmts)) {
    throw `Invalid function: second element must be a list of statements, found '${JSON.stringify(stmts)}'`;
  }

  return { name: name, stmts: stmts.map(def => Stmt.create(def)) };
};

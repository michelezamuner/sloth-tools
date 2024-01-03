const stmt = require('./stmt');

exports.create = (name, stmts) => ({ name: name, stmts: stmts.map(def => stmt.create(def)) });

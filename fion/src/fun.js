const stmt = require('./stmt');

exports.create = (name, stmts) => ({ name: name, stmts: Object.entries(stmts).map(([k, v]) => stmt.create(k, v)) });

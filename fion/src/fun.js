exports.create = (name, stmts) => ({ name: name, stmts: stmts });

exports.name = (fun) => fun.name;

exports.stmts = (fun) => fun.stmts;

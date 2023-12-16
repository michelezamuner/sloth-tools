exports.compile = ast => Buffer.from([0x00, parseInt(ast.funs[0].stmts[0].expr.id)]);

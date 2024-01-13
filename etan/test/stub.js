const { Ast, Stmt } = require('fion');

exports.parse = (code, ctx = []) => {
  const ast = parse(code);
  const main = ast.funs.find(({ name }) => name === 'main');
  const newCtx = main.stmts.filter(({ type }) => type === Stmt.DEC);
  main.stmts.unshift(...ctx);

  return { ast: ast, ctx: [...ctx, ...newCtx] };
};

function parse(code) {
  const parts = code.split(' ');
  let stmts = [];

  switch (parts[0]) {
  case 'exit': {
    if (!isNaN(parts[1])) {
      stmts.push(['RET', ['BYTE', +parts[1]]]);
      break;
    }
    stmts.push(['RET', ['REF', parts[1]]]);
    break;
  } default:
    stmts.push(['DEC', 'a', ['BYTE', +parts[1]]]);
    stmts.push(['RET', ['BYTE', 0x00]]);
  }

  return Ast.create([['main', stmts]]);
}


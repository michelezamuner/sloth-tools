const { ast, stmt } = require('fion');

exports.parse = code => {
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

  return ast.create({ 'main': stmts });
};

exports.consume = (a, ctx) => {
  const main = a.funs.find(({ name }) => name === 'main');
  const newCtx = main.stmts.filter(({ type }) => type === stmt.DEC);
  main.stmts.unshift(...ctx);

  return { ast: a, ctx: [...ctx, ...newCtx] };
};

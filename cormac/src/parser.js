const { Stmt } = require('fion');

const Lexer = require('./lexer');
const Parser = require('./parser/module');

exports.parse = (code, ctx = []) => {
  // @todo: use a better check
  if (code.indexOf('fun main') === -1) {
    code = `fun main ${code}`;
  }

  const lexemes = Lexer.parse(code);
  const ast = Parser.parse(lexemes);

  const main = ast.funs.find(({ name }) => name === 'main');
  if (!main.stmts.find(({ type }) => type === Stmt.RET)) {
    main.stmts.push(Stmt.create(['RET', ['BYTE', 0x00]]));
  }

  const newCtx = main.stmts.filter(({ type }) => type === Stmt.DEC);
  main.stmts.unshift(...ctx);

  return { ast: ast, ctx: [...ctx, ...newCtx] };
};

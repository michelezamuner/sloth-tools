const { Ast, Stmt } = require('fion');

const Lexer = require('./lexer');
const Parser = require('./parser/expr');

exports.parse = (code, ctx = []) => {
  const lexemes = Lexer.parse(code);
  const ast = Ast.create([['main', [['RET', Parser.parse(lexemes)]]]]);

  // @todo: maybe duplication?
  const main = ast.funs.find(({ name }) => name === 'main');
  const newCtx = main.stmts.filter(({ type }) => type === Stmt.DEC);
  main.stmts.unshift(...ctx);

  return { ast: ast, ctx: [...ctx, ...newCtx] };
};

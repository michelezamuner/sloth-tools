const { Ast, Stmt } = require('fion');

const Lexer = require('./lexer');
const Parser = require('./parser/block');

exports.parse = (code, ctx = []) => {
  const lexemes = Lexer.parse(code);

  const visitors = {
    block: block => {
      const last = block[block.length - 1];
      if ([Stmt.ASM, Stmt.DEC].includes(last.type)) {
        block = [...block, Stmt.create(['RET', ['BYTE', '0x00']])];
      }

      return block;
    },
  };

  const ast = Ast.create([['main', Parser.parse(lexemes, visitors)]]);

  const main = ast.funs.find(({ name }) => name === 'main');
  const newCtx = main.stmts.filter(({ type }) => [Stmt.DEC, Stmt.ASM].includes(type));
  main.stmts.unshift(...ctx);

  return { ast: ast, ctx: [...ctx, ...newCtx] };
};

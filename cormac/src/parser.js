const { ast, stmt } = require('fion');
const lexer = require('./lexer');
const parser = require('./parser/block');

exports.parse = code => {
  const lexemes = lexer.parse(code);
  const a = ast.create({ 'main': parser.parse(lexemes) });

  const main = a.funs.find(({ name }) => name === 'main');
  if (!main.stmts.find(({ type }) => type === stmt.RET)) {
    main.stmts.push(stmt.create(['RET', ['BYTE', 0x00]]));
  }

  return a;
};

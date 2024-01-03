const parser = require('./stmt');

exports.parse = lexemes => {
  const block = [];
  const stmt = [];

  for (const lexeme of lexemes) {
    if (lexeme === ';') {
      block.push(parser.parse(stmt));
      stmt.length = 0;

      continue;
    }
    stmt.push(lexeme);
  }
  if (stmt.length) {
    block.push(parser.parse(stmt));
  }

  return block;
};

const Parser = require('./stmt');

exports.parse = lexemes => {
  const block = [];
  const stmt = [];

  for (const lexeme of lexemes) {
    if (lexeme === ';') {
      block.push(Parser.parse(stmt));
      stmt.length = 0;

      continue;
    }
    stmt.push(lexeme);
  }
  if (stmt.length) {
    block.push(Parser.parse(stmt));
  }

  return block;
};

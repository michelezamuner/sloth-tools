const Parser = require('./stmt');

exports.parse = lexemes => {
  let block = [];
  let stmt = [];

  for (const lexeme of lexemes) {
    if (lexeme === ';') {
      block.push(stmt);
      stmt = [];

      continue;
    }
    stmt.push(lexeme);
  }
  if (stmt.length) {
    block.push(stmt);
  }

  return block.map(stmt => Parser.parse(stmt));
};

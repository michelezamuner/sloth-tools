const Parser = require('./stmt');

exports.parse = (lexemes, visitors = {}) => {
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

  let parsedBlock = block.map(stmt => Parser.parse(stmt));

  if (visitors.block) {
    parsedBlock = visitors.block(parsedBlock);
  }

  return parsedBlock;
};

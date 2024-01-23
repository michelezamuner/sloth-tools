const Parser = require('./expr');

// @todo: this should work for other operators too
exports.parse = lexemes => {
  let current = [];
  for (const i in lexemes) {
    const lexeme = lexemes[i];
    if (lexeme === '++' && lexemes[i-1] !== '(') {
      const arg = lexemes[i-1];
      const normalized = ['(++)', '(', arg, ')'];
      current = [...current.slice(0, -1), ...normalized];

      continue;
    }
    current.push(lexeme);
  }

  return Parser.parse(current);
};

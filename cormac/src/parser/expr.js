const { expr } = require('fion');

exports.parse = lexemes => _parse(lexemes);

function _parse(lexemes) {
  if (lexemes.length === 1) {
    return expr.create(['BYTE', lexemes[0]]);
  }

  const expr_lexemes = [];

  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];

    if (lexeme === '++') {
      return expr.create(['INCR', _parse([expr_lexemes[0]])]);
    }

    expr_lexemes.push(lexeme);
  }
}

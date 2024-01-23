const { Expr } = require('fion');

exports.parse = lexemes => _parse(lexemes);

function _parse(lexemes) {
  if (lexemes.length === 1) {
    if (lexemes[0].type) {
      return lexemes[0];
    }

    if (!isNaN(lexemes[0])) {
      return Expr.create(['BYTE', lexemes[0]]);
    }

    return Expr.create(['REF', lexemes[0]]);
  }

  const [fun, ...args] = lexemes.filter(l => !['(', ')'].includes(l));

  return Expr.create(['CALL', _parse([fun]), ...args.map(a => _parse([a]))]);
}

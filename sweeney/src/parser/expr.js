const { Expr } = require('fion');

exports.parse = lexemes => _parse(lexemes);

function _parse(lexemes) {
  return Expr.create(['BYTE', lexemes[0]]);
}

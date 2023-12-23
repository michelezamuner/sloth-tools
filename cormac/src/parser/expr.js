const { expr } = require('fion');
const operatorsDefinitions = require('./operators.json');

exports.parse = lexemes => _parse(lexemes);

function _parse(lexemes) {
  if (lexemes.length === 1) {
    if (lexemes[0].type) {
      return lexemes[0];
    }

    if (!isNaN(lexemes[0])) {
      return expr.create(['BYTE', lexemes[0]]);
    }

    return expr.create(['REF', lexemes[0]]);
  }

  const expr_lexemes = [];

  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];

    expr_lexemes.push(lexeme);

    if (expr_lexemes[0] === '(' && expr_lexemes[2] === ')' && operators.includes(expr_lexemes[1])) {
      const operatorDefinition = operatorsDefinitions[expr_lexemes[1]];
      expr_lexemes.length = 0;
      expr_lexemes.push(expr.create(operatorDefinition));
    }
  }

  if (expr_lexemes.length === 1) {
    return _parse([expr_lexemes[0]]);
  }

  if (expr_lexemes[1] !== '(' && expr_lexemes[expr_lexemes.length - 1] !== ')') {
    throw 'Invalid function call';
  }

  const [fun, ...args] = expr_lexemes.filter(l => !['(', ')'].includes(l));

  return expr.create(['CALL', _parse([fun]), ...args.map(a => _parse([a]))]);
}

const operators = Object.keys(operatorsDefinitions);

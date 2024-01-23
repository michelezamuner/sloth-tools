const operatorsDefinitions = require('./operators.json');

exports.parse = code => {
  const lexemes = [];
  const lexeme = [];

  const chars = code.split('');
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char.trim() === '') {
      if (lexeme.length) {
        lexemes.push(lexeme.join(''));
        lexeme.length = 0;
      }

      continue;
    }

    const operator = _matchOperator(chars, i);
    if (operator) {
      if (lexeme.length) {
        lexemes.push(lexeme.join(''));
        lexeme.length = 0;
      }

      lexemes.push(operator);
      i += operator.length - 1;

      continue;
    }

    if (char === '(') {
      if (lexeme.length) {
        lexemes.push(lexeme.join(''));
        lexeme.length = 0;
      }

      const operator = _matchOperator(chars, +i + 1);
      if (operator && chars[+i + operator.length + 1] === ')') {
        lexemes.push(`(${operator})`);
        i += operator.length + 1;

        continue;
      }

      lexemes.push(char);

      continue;
    }

    if (char === ')' || char === ';') {
      if (lexeme.length) {
        lexemes.push(lexeme.join(''));
        lexeme.length = 0;
      }

      lexemes.push(char);

      continue;
    }

    lexeme.push(char);
  }

  if (lexeme.length) {
    lexemes.push(lexeme.join(''));
    lexeme.length = 0;
  }


  return lexemes;
};

const operators = Object.keys(operatorsDefinitions);

function _matchOperator(chars, i) {
  let operator = null;
  for (const op of operators) {
    const opChars = op.split('');
    let allMatch = true;
    for (let j = 0; j < opChars.length; j++) {
      if (chars[+i + j] !== opChars[j]) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) {
      operator = op;
      break;
    }
  }
  if (operator) {
    return operator;
  }
}

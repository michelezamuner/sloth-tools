const parser = require('./normalizer');
const { expr } = require('fion');
const operatorsDefinitions = require('./operators.json');

exports.parse = lexemes => _parse(lexemes);

function _parse(lexemes) {
  const groups = [[]];

  for (const lexeme of lexemes) {
    if (lexeme === '(') {
      groups.push([]);

      continue;
    }

    if (lexeme === ')') {
      const group = groups.pop();
      if (group.length === 1 && operators.includes(group[0])) {
        groups[groups.length - 1].push(parser.parse(['(', ...group, ')']));
      } else if (groups.length && groups[groups.length - 1].length && (!groups[groups.length - 1][groups[groups.length - 1].length - 1].type || groups[groups.length - 1][groups[groups.length - 1].length - 1].type === expr.REF)) {
        groups[groups.length - 1].push('(');
        groups[groups.length - 1].push(parser.parse(group));
        groups[groups.length - 1].push(')');
      } else {
        groups[groups.length - 1].push(parser.parse(group));
      }

      continue;
    }

    groups[groups.length - 1].push(lexeme);
  }

  return parser.parse(groups[0]);
}

const operators = Object.keys(operatorsDefinitions);

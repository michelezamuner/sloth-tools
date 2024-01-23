exports.parse = lexemes => _parse(lexemes);

const Parser = require('./normalizer');

function _parse(lexemes) {
  const groups = [[]];

  for (const lexeme of lexemes) {
    if (lexeme === '(') {
      groups.push([]);

      continue;
    }

    if (lexeme === ')') {
      const group = groups.pop();
      groups[groups.length - 1].push(Parser.parse(group));

      continue;
    }

    groups[groups.length - 1].push(lexeme);
  }

  return Parser.parse(groups[0]);
}

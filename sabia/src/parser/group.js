const innerParse = require('../parser').parse;

const parse = lexemes => {
  const out = [[]];
  for (const lexeme of lexemes) {
    if (lexeme === '(') {
      out.push([]);

      continue;
    }

    if (lexeme === ')') {
      out[out.length - 1].push({ scope: -1 });
      out[out.length - 2].push(innerParse(out[out.length - 1]));
      delete out[out.length - 1];
      out.length--;

      continue;
    }

    out[out.length - 1].push(lexeme);
  }

  return innerParse(out[out.length - 1]);
};

exports.parse = parse;

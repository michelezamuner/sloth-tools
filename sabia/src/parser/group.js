exports.parse = (lexemes, innerParse) => {
  const out = [[]];
  for (const lexeme of lexemes) {
    if (lexeme === '(') {
      out.push([]);

      continue;
    }

    if (lexeme === ')') {
      out[out.length - 2].push(innerParse(out[out.length - 1]));
      delete out[out.length - 1];
      out.length--;

      continue;
    }

    out[out.length - 1].push(lexeme);
  }

  return out[out.length - 1];
};

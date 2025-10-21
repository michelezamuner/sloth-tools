const Lexer = require('./lexer');
const Normalizer = require('./normalizer');
const Parser = require('./parser');

exports.parse = code => {
  const lexemes = Lexer.parse(code);
  const normalized = Normalizer.parse(lexemes);
  const ast = Parser.parse(normalized);

  return ast;
};

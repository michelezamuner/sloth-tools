const Lexer = require('./lexer');
const Normalizer = require('./normalizer');
const Parser = require('./parser');

exports.parse = (code, config) => {
  const lexemes = Normalizer.parse(Lexer.parse(code), config);

  return Parser.parse(lexemes);
};

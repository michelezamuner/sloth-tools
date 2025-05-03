const Lexer = require('./lexer');
const Resolver = require('./resolver');

exports.parse = code => {
  const lexemes = Lexer.parse(code);

  return Resolver.parse(lexemes);
};

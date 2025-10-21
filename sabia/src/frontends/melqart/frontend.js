const Lexer = require('./lexer');
const Resolver = require('./resolver');
const Parser = require('./parser');

exports.parse = code => {
  const lexemes = Resolver.parse(Lexer.parse(code));

  return Parser.parse(lexemes);
};

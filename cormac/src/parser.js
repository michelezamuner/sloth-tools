const Lexer = require('./lexer');
const Parser = require('./parser/module');

exports.parse = code => {
  let lexemes = Lexer.parse(code);

  const ast = Parser.parse(lexemes);

  return { ast: ast };
};

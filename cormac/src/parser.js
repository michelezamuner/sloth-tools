const { ast } = require('fion');
const lexer = require('./lexer');
const parser = require('./parser/block');

exports.parse = code => {
  const lexemes = lexer.parse(code);

  return ast.create({ 'main': parser.parse(lexemes) });
};

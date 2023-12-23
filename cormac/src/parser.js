const { ast } = require('fion');
const lexer = require('./lexer');
const parser = require('./parser/group');

exports.parse = code => {
  const lexemes = lexer.parse(code);

  return ast.create({ 'main': { 'RET':  parser.parse(lexemes)} });
};

const { ast } = require('fion');
const lexer = require('./lexer');
const expr = require('./parser/expr');

exports.parse = code => {
  const lexemes = lexer.parse(code);

  return ast.create({ 'main': { 'RET':  expr.parse(lexemes)} });
};

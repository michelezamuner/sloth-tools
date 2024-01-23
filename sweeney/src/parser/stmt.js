const { Stmt } = require('fion');

const Parser = require('./group');

exports.parse = lexemes => {
  if (lexemes[0] === 'var') {
    return Stmt.create(['DEC', lexemes[1], Parser.parse(lexemes.slice(2))]);
  }

  if (lexemes[1] === '=') {
    return Stmt.create(['ASM', ['REF', lexemes[0]], Parser.parse(lexemes.slice(2))]);
  }

  return Stmt.create(['RET', Parser.parse(lexemes)]);
};

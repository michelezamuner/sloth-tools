const { stmt } = require('fion');
const parser = require('./group');

exports.parse = lexemes => {
  if (lexemes[1] === ':=') {
    return stmt.create(['DEC', lexemes[0], parser.parse(lexemes.slice(2))]);
  }

  if (lexemes[1] === '=') {
    return stmt.create(['ASM', ['VAR', lexemes[0]], parser.parse(lexemes.slice(2))]);
  }

  return stmt.create(['RET', parser.parse(lexemes)]);
};

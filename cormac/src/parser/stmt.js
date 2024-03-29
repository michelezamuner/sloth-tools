const { Stmt } = require('fion');

const Parser = require('./group');

exports.parse = lexemes => {
  if (lexemes[1] === '=') {
    return Stmt.create(['ASM', ['VAR', lexemes[0]], Parser.parse(lexemes.slice(2))]);
  }

  if (lexemes[1] === ':=') {
    return Stmt.create(['DEC', lexemes[0], Parser.parse(lexemes.slice(2))]);
  }

  if (lexemes[0] === 'ret') {
    return Stmt.create(['RET', Parser.parse(lexemes.slice(1))]);
  }

  throw `Invalid statement '${JSON.stringify(lexemes)}'`;
};

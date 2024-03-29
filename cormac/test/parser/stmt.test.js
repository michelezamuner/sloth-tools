const { Stmt } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/stmt');

describe('statement parser', () => {
  it('parses return', () => {
    const lexemes = Lexer.parse('ret 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['RET', ['BYTE', 0x12]]));
  });

  it('parses declaration', () => {
    const lexemes = Lexer.parse('a := 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['DEC', 'a', ['BYTE', 0x12]]));
  });

  it('parses assignment', () => {
    const lexemes = Lexer.parse('a = 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]));
  });

  it('errors if invalid statement', () => {
    const lexemes = Lexer.parse('0x12');

    expect(() => parse(lexemes)).toThrow('Invalid statement \'["0x12"]\'');
  });
});

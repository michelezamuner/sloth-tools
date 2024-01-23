const { Stmt } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/stmt');

describe('statement parser', () => {
  it('parses implicit return', () => {
    const lexemes = Lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['RET', ['BYTE', 0x12]]));
  });

  it('parses variable declaration', () => {
    const lexemes = Lexer.parse('var a 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['DEC', 'a', ['BYTE', 0x12]]));
  });

  it('parses variable assignment', () => {
    const lexemes = Lexer.parse('a = 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['ASM', ['REF', 'a'], ['BYTE', 0x12]]));
  });
});

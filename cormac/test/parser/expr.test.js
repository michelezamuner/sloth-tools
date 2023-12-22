const { parse } = require('../../src/parser/expr');
const lexer = require('../../src/lexer');
const { expr } = require('fion');

describe('expr parser', () => {
  it('parses byte expression', () => {
    const lexemes = lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['BYTE', 0x12]));
  });

  it('parses incr expression', () => {
    const lexemes = lexer.parse('0x12++');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['INCR', ['BYTE', 0x12]]));
  });
});

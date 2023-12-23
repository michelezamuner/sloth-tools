const { parse } = require('../../src/parser/expr');
const lexer = require('../../src/lexer');
const { expr } = require('fion');

describe('expr parser', () => {
  it('parses ast', () => {
    const lexemes = [ expr.create(['BYTE', 0x12]) ];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['BYTE', 0x12]));
  });

  it('parses byte', () => {
    const lexemes = lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['BYTE', 0x12]));
  });

  it('parses reference', () => {
    const lexemes = lexer.parse('ref');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['REF', 'ref']));
  });

  it('parses incr reference', () => {
    const lexemes = lexer.parse('(++)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['REF', 'INCR']));
  });

  it('parses fun call', () => {
    const lexemes = lexer.parse('fun(0x12)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['CALL', ['REF', 'fun'], ['BYTE', 0x12]]));
  });

  it('errors on invalid fun call', () => {
    const lexemes = lexer.parse('(++)0x12');

    expect(() => parse(lexemes)).toThrow('Invalid function call');
  });
});

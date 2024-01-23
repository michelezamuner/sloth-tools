const { Expr } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/expr');

describe('expr parser', () => {
  it('parses byte', () => {
    const lexemes = Lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['BYTE', 0x12]));
  });

  it('parses byte ast', () => {
    const lexemes = [ Expr.create(['BYTE', 0x12]) ];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['BYTE', 0x12]));
  });

  it('parses reference', () => {
    const lexemes = Lexer.parse('ref');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['REF', 'ref']));
  });

  it('parses fun call', () => {
    const lexemes = Lexer.parse('fun(0x12)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['CALL', ['REF', 'fun'], ['BYTE', 0x12]]));
  });
});

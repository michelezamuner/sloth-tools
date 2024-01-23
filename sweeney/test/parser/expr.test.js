const { Expr } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/expr');

describe('expr parser', () => {
  it('parses byte', () => {
    const lexemesCode = Lexer.parse('0x12');

    const astCode = parse(lexemesCode);

    expect(astCode).toStrictEqual(Expr.create(['BYTE', 0x12]));

    const lexemesAst = [ Expr.create(['BYTE', 0x12]) ];

    const astAst = parse(lexemesAst);

    expect(astAst).toStrictEqual(Expr.create(['BYTE', 0x12]));
  });

  it('parses reference', () => {
    const lexemesCode = Lexer.parse('a');

    const astCode = parse(lexemesCode);

    expect(astCode).toStrictEqual(Expr.create(['REF', 'a']));

    const lexemesAst = [ Expr.create(['REF', 'a']) ];

    const astAst = parse(lexemesAst);

    expect(astAst).toStrictEqual(Expr.create(['REF', 'a']));
  });

  it('parses incr reference', () => {
    const lexemes = Lexer.parse('(++)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['REF', 'INCR']));
  });

  it('parses fun call', () => {
    const lexemes = Lexer.parse('fun(0x12)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['CALL', ['REF', 'fun'], ['BYTE', 0x12]]));
  });
});

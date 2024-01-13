const { Expr } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/group');

describe('group parser', () => {
  it('parses code with no groups', () => {
    const lexemes = Lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['BYTE', 0x12]));
  });

  it('parses group of unary expression', () => {
    const lexemes = Lexer.parse('(0x12)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['BYTE', 0x12]));
  });

  it('parses group containing function call', () => {
    const lexemes = Lexer.parse('fun(0x12)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['CALL', ['REF', 'fun'], ['BYTE', 0x12]]));
  });

  it('parses group containing operator reference and function call', () => {
    const lexemes = Lexer.parse('((++)(0x12))');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]));
  });

  it('parses nested groups', () => {
    const lexemes = Lexer.parse('((++)((0x12)))');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]));
  });
});

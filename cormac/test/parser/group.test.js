const { parse } = require('../../src/parser/group');
const lexer = require('../../src/lexer');
const { expr } = require('fion');

describe('group parser', () => {
  it('parses code with no groups', () => {
    const lexemes = lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['BYTE', 0x12]));
  });

  it('parses group of unary expression', () => {
    const lexemes = lexer.parse('(0x12)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['BYTE', 0x12]));
  });

  it('parses group containing function call', () => {
    const lexemes = lexer.parse('fun(0x12)');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['CALL', ['REF', 'fun'], ['BYTE', 0x12]]));
  });

  it('parses group containing operator reference and function call', () => {
    const lexemes = lexer.parse('((++)(0x12))');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]));
  });

  it('parses nested groups', () => {
    const lexemes = lexer.parse('((++)((0x12)))');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(expr.create(['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]));
  });
});

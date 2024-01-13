const { Expr } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/expr');

describe('expr parser', () => {
  it('parses byte', () => {
    const lexemes = Lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Expr.create(['BYTE', 0x12]));
  });
});

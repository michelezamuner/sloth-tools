const { Fun } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/module');

describe('module parser', () => {
  it('parses module with single function definition', () => {
    const lexemes = Lexer.parse('fun main 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ funs: [
      Fun.create(['main', [['RET', ['BYTE', 0x12]]]])
    ] });
  });

  it('parses module with multiple function definitions', () => {
    const lexemes = Lexer.parse(`
      fun main f
      fun f 0x12
    `);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ funs: [
      Fun.create(['main', [['RET', ['REF', 'f']]]]),
      Fun.create(['f', [['RET', ['BYTE', 0x12]]]]),
    ] });
  });
});

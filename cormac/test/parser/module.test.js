const { fun } = require('fion');
const { parse } = require('../../src/parser/module');
const lexer = require('../../src/lexer');

describe('module parser', () => {
  it('parses module with single function definition', () => {
    const lexemes = lexer.parse('fun main 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ funs: [
      fun.create(['main', [['RET', ['BYTE', 0x12]]]])
    ] });
  });

  it('parses module with multiple function definitions', () => {
    const lexemes = lexer.parse(`
      fun main f
      fun f 0x12
    `);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ funs: [
      fun.create(['main', [['RET', ['REF', 'f']]]]),
      fun.create(['f', [['RET', ['BYTE', 0x12]]]]),
    ] });
  });
});

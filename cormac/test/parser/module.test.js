const { Fun } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/module');

describe('module parser', () => {
  it('parses module with single function definition', () => {
    const lexemes = Lexer.parse('fun main ret 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ funs: [
      Fun.create(['main', [['RET', ['BYTE', 0x12]]]])
    ] });
  });

  it('parses module with multiple function definitions', () => {
    const lexemes = Lexer.parse(`
      fun main ret 0x12
      fun f ret 0x12
    `);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ funs: [
      Fun.create(['main', [['RET', ['BYTE', 0x12]]]]),
      Fun.create(['f', [['RET', ['BYTE', 0x12]]]]),
    ] });
  });

  it('parses module with visitor', () => {
    const lexemes = Lexer.parse(`
    fun a 0x11
    fun b 0x12
    `);
    const visitors = { 'module': ([name, lxms]) => [`${name}_`, ['ret', ...lxms]] };

    const ast = parse(lexemes, visitors);

    expect(ast).toStrictEqual({ funs: [
      Fun.create(['a_', [['RET', ['BYTE', 0x11]]]]),
      Fun.create(['b_', [['RET', ['BYTE', 0x12]]]]),
    ] });
  });

  it('errors if invalid function definition', () => {
    expect(() => parse(Lexer.parse('0x12'))).toThrow('Invalid module \'["0x12"]\'');
  });
});

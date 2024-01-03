const { parse } = require('../../src/parser/block');
const lexer = require('../../src/lexer');
const { stmt } = require('fion');

describe('block parser', () => {
  it('parses code with a single statement', () => {
    const lexemes = lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses code with a single statement ending with semicolon', () => {
    const lexemes = lexer.parse('0x12;');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses code with multiple statements', () => {
    const lexemes = lexer.parse('a = 0x12; a');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([
      stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]),
      stmt.create(['RET', ['REF', 'a']]),
    ]);
  });
});

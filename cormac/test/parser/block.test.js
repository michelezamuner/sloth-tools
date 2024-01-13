const { Stmt } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/block');

describe('block parser', () => {
  it('parses code with a single statement', () => {
    const lexemes = Lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([Stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses code with a single statement ending with semicolon', () => {
    const lexemes = Lexer.parse('0x12;');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([Stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses code with multiple statements', () => {
    const lexemes = Lexer.parse('a = 0x12; a');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([
      Stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]),
      Stmt.create(['RET', ['REF', 'a']]),
    ]);
  });
});

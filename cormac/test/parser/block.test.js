const { Stmt } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/block');

describe('block parser', () => {
  it('parses block with a single statement', () => {
    const lexemes = Lexer.parse('ret 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([Stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses block with a single statement ending with semicolon', () => {
    const lexemes = Lexer.parse('ret 0x12;');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([Stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses block with multiple statements', () => {
    const lexemes = Lexer.parse('a = 0x12; ret a');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([
      Stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]),
      Stmt.create(['RET', ['REF', 'a']]),
    ]);
  });
});

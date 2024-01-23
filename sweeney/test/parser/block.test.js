const { Stmt } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/block');

describe('block parser', () => {
  it('parses block with a single statement', () => {
    const lexemes = Lexer.parse('0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([Stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses block with a single statement ending with semicolon', () => {
    const lexemes = Lexer.parse('0x12;');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([Stmt.create(['RET', ['BYTE', 0x12]])]);
  });

  it('parses block with multiple statements', () => {
    const lexemes = Lexer.parse('var a 0x12; a');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual([
      Stmt.create(['DEC', 'a', ['BYTE', 0x12]]),
      Stmt.create(['RET', ['REF', 'a']]),
    ]);
  });

  it('parses block with visitor', () => {
    const lexemes = Lexer.parse('a = 0x12');
    const visitors = { block: block => {
      block.push(Stmt.create(['RET', ['REF', 'a']]));

      return block;
    }};

    const ast = parse(lexemes, visitors);

    expect(ast).toStrictEqual([
      Stmt.create(['ASM', ['REF', 'a'], ['BYTE', 0x12]]),
      Stmt.create(['RET', ['REF', 'a']]),
    ]);
  });
});

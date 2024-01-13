const { Stmt } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/stmt');

describe('statement parser', () => {
  it('parses return', () => {
    const lexemes = Lexer.parse('a++');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['RET', ['CALL', ['REF', 'INCR'], ['REF', 'a']]]));
  });

  it('parses declaration', () => {
    // @todo: make this `a = 0x12` as well, and let the parser remember that this identifier has already been declared
    const lexemes = Lexer.parse('a := 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['DEC', 'a', ['BYTE', 0x12]]));
  });

  it('parses assignment', () => {
    const lexemes = Lexer.parse('a = 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(Stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]));
  });
});

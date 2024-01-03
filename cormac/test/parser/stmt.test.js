const { parse } = require('../../src/parser/stmt');
const lexer = require('../../src/lexer');
const { stmt } = require('fion');

describe('statement parser', () => {
  it('parses return', () => {
    const lexemes = lexer.parse('a++');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(stmt.create(['RET', ['CALL', ['REF', 'INCR'], ['REF', 'a']]]));
  });

  it('parses declaration', () => {
    // @todo: make this `a = 0x12` as well, and let the parser remember that this identifier has already been declared
    const lexemes = lexer.parse('a := 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(stmt.create(['DEC', 'a', ['BYTE', 0x12]]));
  });

  it('parses assignment', () => {
    const lexemes = lexer.parse('a = 0x12');

    const ast = parse(lexemes);

    expect(ast).toStrictEqual(stmt.create(['ASM', ['VAR', 'a'], ['BYTE', 0x12]]));
  });
});

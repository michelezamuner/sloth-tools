const { Expr } = require('fion');

const Lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/normalizer');

describe('normalizer', () => {
  it('parses already normalized code', () => {
    const lexemes = Lexer.parse('(++)');

    const result = parse(lexemes);

    expect(result).toStrictEqual(Expr.create(['REF', 'INCR']));
  });

  it('parses incr operator into function call', () => {
    const lexemes = Lexer.parse('0x12++');

    const result = parse(lexemes);

    expect(result).toStrictEqual(Expr.create(['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]));
  });
});

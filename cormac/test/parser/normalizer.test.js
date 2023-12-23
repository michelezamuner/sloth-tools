const lexer = require('../../src/lexer');
const { parse } = require('../../src/parser/normalizer');
const { expr } = require('fion');

describe('normalizer', () => {
  it('parses already normalized code', () => {
    const lexemes = lexer.parse('(++)');

    const result = parse(lexemes);

    expect(result).toStrictEqual(expr.create(['REF', 'INCR']));
  });

  it('parses incr operator into function call', () => {
    const lexemes = lexer.parse('0x12++');

    const result = parse(lexemes);

    expect(result).toStrictEqual(expr.create(['CALL', ['REF', 'INCR'], ['BYTE', 0x12]]));
  });
});

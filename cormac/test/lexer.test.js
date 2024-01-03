const { parse } = require('../src/lexer');

describe('lexer', () => {
  it('parses identifiers', () => {
    const code = 'var';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['var']);
  });

  it('parses increment operator', () => {
    const code = 'var++';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['var', '++']);
  });

  it('parses parenthesis', () => {
    const code = 'fun ( var )';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['fun', '(', 'var', ')']);
  });

  it('parses declaration', () => {
    const code = 'a := 1';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['a', ':=', '1']);
  });

  it('parses assignment', () => {
    const code = 'a = 1';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['a', '=', '1']);
  });

  it('parses statements separator', () => {
    const code = 'a; b; c';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['a', ';', 'b', ';', 'c']);
  });
});

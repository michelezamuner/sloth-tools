const { parse } = require('../src/lexer');

describe('lexer', () => {
  it('parses single identifier', () => {
    const code = 'var';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['var']);
  });

  it('parses increment operator', () => {
    const code = 'var++';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['var', '++']);
  });

  it('parses empty function call', () => {
    const code = 'fun()';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['fun', '(', ')']);
  });

  it('parses function call with single argument', () => {
    const code = 'fun(var)';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['fun', '(', 'var', ')']);
  });
});

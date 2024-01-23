const { parse } = require('../src/lexer');

describe('lexer', () => {
  it('parses single lexemes', () => {
    const code = '0x12';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['0x12']);
  });

  it('parses space-separated lexemes', () => {
    const code = 'dec a 0x12';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['dec', 'a', '0x12']);
  });

  it('parses grouped lexemes', () => {
    const code = '(f(0x12))';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['(', 'f', '(', '0x12', ')', ')']);
  });

  it('parses increment operator as suffix', () => {
    const code = '(0x12)++';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['(', '0x12', ')', '++']);
  });

  it('parses increment operator as reference', () => {
    const code = '(++)(0x12)';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['(++)', '(', '0x12', ')']);
  });

  it('parses blocks', () => {
    const code = 'var a 0x12; a = a++; a';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['var', 'a', '0x12', ';', 'a', '=', 'a', '++', ';', 'a']);
  });
});

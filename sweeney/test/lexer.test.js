const { parse } = require('../src/lexer');

describe('lexer', () => {
  it('parses values', () => {
    const code = '0x12';

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['0x12']);
  });
});

const Lexer = require('../../../src/frontends/melqart/lexer');

describe('melqart lexer', () => {
  it('parses enum expression', () => {
    const code = `
      [T] A
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['[', 'T', ']', 'A']);
  });
});

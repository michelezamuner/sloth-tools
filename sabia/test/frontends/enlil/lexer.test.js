const Lexer = require('../../../src/frontends/enlil/lexer');

describe('Enlil lexer', () => {
  it('parses enum expression', () => {
    const code = `
      T.A
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['T.A']);
  });
});

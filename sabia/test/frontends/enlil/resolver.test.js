const Lexer = require('../../../src/frontends/enlil/lexer');
const Resolver = require('../../../src/frontends/enlil/resolver');

describe('enlil resolver', () => {
  it('parses enum expression', () => {
    const code = `
      T.A
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Resolver.parse(rawLexemes);

    expect(lexemes).toStrictEqual(['T.A']);
  });
});

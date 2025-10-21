const Lexer = require('../../../src/frontends/melqart/lexer');
const Resolver = require('../../../src/frontends/melqart/resolver');

describe('melqart resolver', () => {
  it('parses enum expression', () => {
    const code = `
      [T] A
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Resolver.parse(rawLexemes);

    expect(lexemes).toStrictEqual(['[', 'T', ']', 'A']);
  });
});

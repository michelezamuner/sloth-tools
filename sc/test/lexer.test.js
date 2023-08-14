const Lexer = require('../src/lexer');

describe('lexer', () => {
  let lexer = null;

  beforeEach(() => {
    lexer = new Lexer();
  });

  it('parses unit expression', () => {
    const code = 'value';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['value']);
  });

  it('parses namespaced unit expression', () => {
    const code = 'namespace.value';
    const lexemes = lexer.parse(code);

    expect(lexemes).toStrictEqual(['namespace', '.', 'value']);
  });
});

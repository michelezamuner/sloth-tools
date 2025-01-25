const { parse } = require('../../src/parser/group');
const Lexer = require('../../src/lexer');

describe('group parser', () => {
  it('parses code not in parenthesis', () => {
    const code = `
      a b c
    `;
    const lexemes = Lexer.parse(code);

    const parsedLexemes = parse(lexemes, () => {});

    expect(parsedLexemes).toStrictEqual(lexemes);
  });

  it('parses code in parenthesis', () => {
    const code = `
      a (b c)
    `;
    const lexemes = Lexer.parse(code);

    const parsedLexemes = parse(lexemes, tkns => {
      if (JSON.stringify(tkns) === '["b","c"]') {
        return 'parsed';
      }
    });

    expect(parsedLexemes).toStrictEqual(['a', 'parsed']);
  });
});

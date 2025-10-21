const Normalizer = require('../../../../src/frontends/enlil/normalizer/debug');
const Lexer = require('../../../../src/frontends/enlil/lexer');

describe('enlil debug normalizer', () => {
  it('parses debug call', () => {
    const code = `
      mod m {
        fn main(_: Process) -> Exit { dbg!(OK) }
      }
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual([
      'mod', 'm', '{',
      'fn', 'main', '(', '_', ':', 'Process', ')', '->', 'Exit', '{',
      'core', '::', 'lang', '::', 'debug', '(',
      'OK',
      ')', '}', '}',
    ]);
  });
});

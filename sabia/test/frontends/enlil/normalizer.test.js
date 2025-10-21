const Normalizer = require('../../../src/frontends/enlil/normalizer');
const Lexer = require('../../../src/frontends/enlil/lexer');

describe('normalizer', () => {
  it('parses sample code', () => {
    const code = `
      enum T = { A }
      const a = T::A;

      a

      fn fun(a: T) -> T { a }

      fun(a)
    `;
    const config = {
      mod: 'app',
      main: 'main',
      proc: 'proc',
    };
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, config);

    expect(lexemes).toStrictEqual([
      'mod', 'app', '{',
      'enum', 'T', '=', '{', 'A', '}',
      'const', 'a', '=', 'T', '::', 'A', ';',
      'fn', 'fun', '(', 'a', ':', 'T', ')', '->', 'T', '{', 'a', '}',
      'fn', 'main', '(',
      'proc', ':', 'core', '::', 'sys', '::', 'Process',
      ')', '->', 'core', '::', 'sys', '::', 'Exit', '{',
      'core', '::', 'lang', '::', 'then', '(',
      'core', '::', 'lang', '::', 'debug', '(', 'a', ')', ',',
      'core', '::', 'lang', '::', 'then', '(',
      'core', '::', 'lang', '::', 'debug', '(',
      'fun', '(', 'a', ')',
      ')', ',',
      'core', '::', 'sys', '::', 'Exit', '::', 'OK',
      ')', ')', '}', '}',
    ]);
  });
});

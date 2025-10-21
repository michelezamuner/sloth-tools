const Normalizer = require('../../../../src/frontends/enlil/normalizer/script');
const Lexer = require('../../../../src/frontends/enlil/lexer');

describe('enlil script normalizer', () => {
  it('ignore script mode if a module is defined', () => {
    const code = `
      mod m {}
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual(['mod', 'm', '{', '}']);
  });

  it('parses script mode', () => {
    const code = `
      enum Z = { V }
      enum T = { A }

      T::A

      const a = T::A;

      a

      fn fun(a: T) -> T { a }

      fun(a)
    `;
    const rawLexemes = Lexer.parse(code);
    const config = {
      mod: 'module',
      main: 'main',
      proc: 'p',
    };

    const lexemes = Normalizer.parse(rawLexemes, config);

    expect(lexemes).toStrictEqual([
      'mod', 'module', '{',
      'alias', 'core', '::', 'sys', '::', '{',
      'Exit', ',', 'Exit', '::', 'OK', ',', 'Process', '}', ';',
      'enum', 'Z', '=', '{', 'V', '}',
      'enum', 'T', '=', '{', 'A', '}',
      'const', 'a', '=', 'T', '::', 'A', ';',
      'fn', 'fun', '(', 'a', ':', 'T', ')', '->', 'T', '{', 'a', '}',
      'fn', 'main', '(', 'p', ':', 'Process', ')', '->', 'Exit', '{',
      'dbg!', '(', 'T', '::', 'A', ')', ';',
      'dbg!', '(', 'a', ')', ';',
      'dbg!', '(', 'fun', '(', 'a', ')', ')', ';',
      'OK',
      '}', '}',
    ]);
  });
});

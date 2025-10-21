const Normalizer = require('../../../../src/frontends/enlil/normalizer/binding');
const Lexer = require('../../../../src/frontends/enlil/lexer');

describe('enlil binding normalizer', () => {
  it('parses code with no bindings', () => {
    const code = `
      mod m {
        fn main(_: Process) -> Exit { OK }
      }
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual([
      'mod', 'm', '{',
      'fn', 'main', '(', '_', ':', 'Process', ')', '->', 'Exit', '{',
      'OK',
      '}', '}',
    ]);
  });

  it('parses binding of two expressions', () => {
    const code = `
      mod m {
        fn main(_: Process) -> Exit { OK; OK }
      }
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual([
      'mod', 'm', '{',
      'fn', 'main', '(', '_', ':', 'Process', ')', '->', 'Exit', '{',
      'core', '::', 'lang', '::', 'then', '(',
      'OK', ',', 'OK',
      ')', '}', '}',
    ]);
  });

  it('parses binding of more than two expressions', () => {
    const code = `
      mod m {
        fn main(_: Process) -> Exit { OK; OK; OK; OK }
      }
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual([
      'mod', 'm', '{',
      'fn', 'main', '(', '_', ':', 'Process', ')', '->', 'Exit', '{',
      'core', '::', 'lang', '::', 'then', '(',
      'OK', ',',
      'core', '::', 'lang', '::', 'then', '(',
      'OK', ',',
      'core', '::', 'lang', '::', 'then', '(',
      'OK', ',', 'OK',
      ')', ')', ')', '}', '}',
    ]);
  });

  it('parses code with more functions', () => {
    const code = `
      mod m {
        fn f(a: T) -> T { a }
        fn main(_: Process) -> Exit { OK; OK }
      }
    `;
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual([
      'mod', 'm', '{',
      'fn', 'f', '(', 'a', ':', 'T', ')', '->', 'T', '{', 'a', '}',
      'fn', 'main', '(', '_', ':', 'Process', ')', '->', 'Exit', '{',
      'core', '::', 'lang', '::', 'then', '(',
      'OK', ',', 'OK',
      ')', '}', '}',
    ]);
  });
});

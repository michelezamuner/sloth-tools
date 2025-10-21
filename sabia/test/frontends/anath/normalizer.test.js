const Lexer = require('../../../src/frontends/anath/lexer');
const Normalizer = require('../../../src/frontends/anath/normalizer');

describe('anath normalizer', () => {
  it('parses normalized code', () => {
    const code = '::mod { a = b; }';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'mod', '{',
      'a', '=', 'b', ';',
      '}'
    ]);
  });

  it('parses aliases', () => {
    const code = '::mod { @a = mod::a; @b = mod::b; c = a; d = b;}';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'mod', '{',
      'c', '=', 'mod', '::', 'a', ';',
      'd', '=', 'mod', '::', 'b', ';',
      '}'
    ]);
  });

  it('parses aliases within aliases', () => {
    const code = '::mod { @a = mod::a; @b = a::b; c = b; }';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'mod', '{',
      'c', '=', 'mod', '::', 'a', '::', 'b', ';',
      '}'
    ]);
  });

  it('parses debug call', () => {
    const code = '::mod { a = ! s;}';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'mod', '{',
      'a', '=',
      'core', '::', 'lang', '::', 'debug', 's',
      ';', '}'
    ]);
  });

  it('parses default public mod', () => {
    const code = 'mod { a = b; }';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'mod', '{',
      'a', '=', 'b',
      ';', '}'
    ]);
  });

  it('parses script with no code', () => {
    const code = '';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'app', '{',
      '::', 'main', '=',
      'p', ':', 'std', '::', 'sys', '::', 'Proc',
      '->', 'std', '::', 'sys', '::', 'Exit', '(',
      'std', '::', 'sys', '::', 'Exit', '::', 'Ok',
      ')', ';', '}',
    ]);
  });

  it('parses script with single exp', () => {
    const code = 'f a b;';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'app', '{',
      '::', 'main', '=',
      'p', ':', 'std', '::', 'sys', '::', 'Proc',
      '->', 'std', '::', 'sys', '::', 'Exit',
      '(', 'core', '::', 'lang', '::', 'then',
      '(', 'core', '::', 'lang', '::', 'debug',
      '(', 'f', 'a', 'b', ')', ')',
      '(', 'std', '::', 'sys', '::', 'Exit', '::', 'Ok', ')',
      ')', ';', '}',
    ]);
  });

  it('parses script with defs and exps', () => {
    const code = 'T = C; a = T::C; a; f a b;';
    const lexemes = Lexer.parse(code);

    const normalized = Normalizer.parse(lexemes);

    expect(normalized).toStrictEqual([
      '::', 'app', '{',
      'T', '=', 'C', ';',
      'a', '=', 'T', '::', 'C', ';',
      '::', 'main', '=',
      'p', ':', 'std', '::', 'sys', '::', 'Proc',
      '->', 'std', '::', 'sys', '::', 'Exit',
      '(', 'core', '::', 'lang', '::', 'then',
      '(', 'core', '::', 'lang', '::', 'then',
      '(', 'core', '::', 'lang', '::', 'debug', '(', 'a', ')', ')',
      '(', 'core', '::', 'lang', '::', 'debug',
      '(', 'f', 'a', 'b', ')', ')', ')',
      '(', 'std', '::', 'sys', '::', 'Exit', '::', 'Ok', ')',
      ')', ';', '}',
    ]);
  });
});

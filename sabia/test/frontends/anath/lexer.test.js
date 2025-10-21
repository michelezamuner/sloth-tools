const Lexer = require('../../../src/frontends/anath/lexer');

describe('anath lexer', () => {
  it('parses ref expression', () => {
    const code = 'ref';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['ref']);
  });

  it('parses ref expression in parenthesis', () => {
    const code = '(ref)';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['(', 'ref', ')']);
  });

  it('parses ref expression with modules', () => {
    const code = 'mod1::mod2::ref';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['mod1', '::', 'mod2', '::', 'ref']);
  });

  it('parses cons expression', () => {
    const code = 'Type::Cons';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['Type', '::', 'Cons']);
  });

  it('parses cons expression with modules', () => {
    const code = 'mod1::mod2::Type::Cons';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['mod1', '::', 'mod2', '::', 'Type', '::', 'Cons']);
  });

  it('parses cons expression with parameters', () => {
    const code = 'Type<Type1, Type2<Type3>>::Cons';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['Type', '<', 'Type1', ',', 'Type2', '<', 'Type3', '>', '>', '::', 'Cons']);
  });

  it('parses function expression', () => {
    const code = 'a: Type1 -> Type2 a';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['a', ':', 'Type1', '->', 'Type2', 'a']);
  });

  it('parses function expression with modules', () => {
    const code = 'a: mod::T -> mod::T a';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['a', ':', 'mod', '::', 'T', '->', 'mod', '::', 'T', 'a']);
  });

  it('parses function expression with parameters', () => {
    const code = 'a: T<U, V> -> T<U, V> a';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['a', ':', 'T', '<', 'U', ',', 'V', '>', '->', 'T', '<', 'U', ',', 'V', '>', 'a']);
  });

  it('parses eval expression of ref', () => {
    const code = 'a b';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['a', 'b']);
  });

  it('parses eval expression of cons', () => {
    const code = 'Type<U>::Cons a';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['Type', '<', 'U', '>', '::', 'Cons', 'a']);
  });

  it('parses eval expression of function', () => {
    const code = 'a: T -> T a b';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['a', ':', 'T', '->', 'T', 'a', 'b']);
  });

  it('parses eval expression of eval', () => {
    const code = 'a b c';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['a', 'b', 'c']);
  });

  it('parses type definition', () => {
    const code = 'T = A | B;';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['T', '=', 'A', '|', 'B', ';']);
  });

  it('parses type definition with parameters', () => {
    const code = 'T<U, V> = A U | D V;';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['T', '<', 'U', ',', 'V', '>', '=', 'A', 'U', '|', 'D', 'V', ';']);
  });

  it('parses public type definition', () => {
    const code = '::T = A | B;';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['::', 'T', '=', 'A', '|', 'B', ';']);
  });

  it('parses ref definition', () => {
    const code = 'a = T::A;';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['a', '=', 'T', '::', 'A', ';']);
  });

  it('parses public ref definition', () => {
    const code = '::a = T::A;';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['::', 'a', '=', 'T', '::', 'A', ';']);
  });

  it('parses mod definition', () => {
    const code = 'mod { a = T::A; ::T = A | B; }';

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['mod', '{', 'a', '=', 'T', '::', 'A', ';', '::', 'T', '=', 'A', '|', 'B', ';', '}']);
  });
});

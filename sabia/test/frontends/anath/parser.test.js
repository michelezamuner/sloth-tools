const Lexer = require('../../../src/frontends/anath/lexer');
const Parser = require('../../../src/frontends/anath/parser');

describe('anath parser', () => {
  it('parses ref expression', () => {
    const code = 'ref';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'ref',
      name: 'ref',
    });
  });

  it('parses grouped ref expression', () => {
    const code = '(ref)';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'ref',
      name: 'ref',
    });
  });

  it('parses ref expression with modules', () => {
    const code = 'mod1::mod2::ref';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'ref',
      name: 'mod1::mod2::ref',
    });
  });

  it('parses grouped ref expression with modules', () => {
    const code = '(mod1::mod2::ref)';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'ref',
      name: 'mod1::mod2::ref',
    });
  });

  it('parses cons expression', () => {
    const code = 'Type::Cons';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'cons',
      type: {
        elem: 'type',
        name: 'Type',
        params: [],
      },
      name: 'Cons',
    });
  });

  it('parses grouped cons expression', () => {
    const code = '(Type::Cons)';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'cons',
      type: {
        elem: 'type',
        name: 'Type',
        params: [],
      },
      name: 'Cons',
    });
  });

  it('parses cons expression with modules', () => {
    const code = 'mod1::mod2::Type::Cons';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'cons',
      type: {
        elem: 'type',
        name: 'mod1::mod2::Type',
        params: [],
      },
      name: 'Cons',
    });
  });

  it('parses grouped cons expression with modules', () => {
    const code = '(mod1::mod2::Type::Cons)';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'cons',
      type: {
        elem: 'type',
        name: 'mod1::mod2::Type',
        params: [],
      },
      name: 'Cons',
    });
  });

  it('parses cons expression with parameters', () => {
    const code = 'Type<Type1, Type2<Type3>>::Cons';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'cons',
      type: {
        elem: 'type',
        name: 'Type',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          {
            elem: 'type',
            name: 'Type2',
            params: [{ elem: 'type', name: 'Type3', params: [] }],
          },
        ],
      },
      name: 'Cons',
    });
  });

  it('parses grouped cons expression with parameters', () => {
    const code = '(Type<Type1, Type2<Type3>>::Cons)';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'cons',
      type: {
        elem: 'type',
        name: 'Type',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          {
            elem: 'type',
            name: 'Type2',
            params: [{ elem: 'type', name: 'Type3', params: [] }],
          },
        ],
      },
      name: 'Cons',
    });
  });

  it('parses function expression with reference body', () => {
    const code = 'a: mod::Type1 -> mod::Type2 a';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'mod::Type1', params: [] },
          { elem: 'type', name: 'mod::Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'mod::Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'ref',
        name: 'a',
      },
    });
  });

  it('parses grouped function expression with reference body', () => {
    const code = '(a: mod::Type1 -> mod::Type2 (a))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'mod::Type1', params: [] },
          { elem: 'type', name: 'mod::Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'mod::Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'ref',
        name: 'a',
      },
    });
  });

  it('parses function expression with cons body', () => {
    const code = 'a: Type1 -> Type2 Type<Type1, Type2>::Cons';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          { elem: 'type', name: 'Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'cons',
        type: {
          elem: 'type',
          name: 'Type',
          params: [
            { elem: 'type', name: 'Type1', params: [] },
            { elem: 'type', name: 'Type2', params: [] },
          ],
        },
        name: 'Cons',
      },
    });
  });

  it('parses grouped function expression with cons body', () => {
    const code = '(a: Type1 -> Type2 (Type<Type1, Type2>::Cons))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          { elem: 'type', name: 'Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'cons',
        type: {
          elem: 'type',
          name: 'Type',
          params: [
            { elem: 'type', name: 'Type1', params: [] },
            { elem: 'type', name: 'Type2', params: [] },
          ],
        },
        name: 'Cons',
      },
    });
  });

  it('parses function expression with function body', () => {
    const code = 'a: Type1 -> Type2 a: Type1 -> Type2 a';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          { elem: 'type', name: 'Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'fun',
        type: {
          elem: 'type',
          name: 'core::lang::Fun',
          params: [
            { elem: 'type', name: 'Type1', params: [] },
            { elem: 'type', name: 'Type2', params: [] },
          ],
        },
        arg: {
          elem: 'def',
          var: 'arg',
          name: 'a',
          type: { elem: 'type', name: 'Type1', params: [] },
        },
        body: {
          elem: 'exp',
          var: 'ref',
          name: 'a',
        },
      },
    });
  });

  it('parses grouped function expression with function body', () => {
    const code = '(a: Type1 -> Type2 (a: Type1 -> Type2 (a)))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          { elem: 'type', name: 'Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'fun',
        type: {
          elem: 'type',
          name: 'core::lang::Fun',
          params: [
            { elem: 'type', name: 'Type1', params: [] },
            { elem: 'type', name: 'Type2', params: [] },
          ],
        },
        arg: {
          elem: 'def',
          var: 'arg',
          name: 'a',
          type: { elem: 'type', name: 'Type1', params: [] },
        },
        body: {
          elem: 'exp',
          var: 'ref',
          name: 'a',
        },
      },
    });
  });

  it('parses function expression with eval body', () => {
    const code = 'a: Type1 -> Type2 (a b)';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          { elem: 'type', name: 'Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'ref', name: 'a' },
        arg: { elem: 'exp', var: 'ref', name: 'b' },
      },
    });
  });

  it('parses grouped function expression with eval body', () => {
    const code = '(a: Type1 -> Type2 ((a) (b)))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [
          { elem: 'type', name: 'Type1', params: [] },
          { elem: 'type', name: 'Type2', params: [] },
        ],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: { elem: 'type', name: 'Type1', params: [] },
      },
      body: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'ref', name: 'a' },
        arg: { elem: 'exp', var: 'ref', name: 'b' },
      },
    });
  });

  it('parses eval expression of ref', () => {
    const code = 'a b';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'ref', name: 'a' },
      arg: { elem: 'exp', var: 'ref', name: 'b' },
    });
  });

  it('parses grouped eval expression of ref', () => {
    const code = '((a) (b))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'ref', name: 'a' },
      arg: { elem: 'exp', var: 'ref', name: 'b' },
    });
  });

  it('parses eval expression of cons', () => {
    const code = 'Type<U>::Cons a';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: {
        elem: 'exp',
        var: 'cons',
        type: {
          elem: 'type',
          name: 'Type',
          params: [{ elem: 'type', name: 'U', params: [] }],
        },
        name: 'Cons',
      },
      arg: { elem: 'exp', var: 'ref', name: 'a' },
    });
  });

  it('parses grouped eval expression of cons', () => {
    const code = '((Type<U>::Cons) (a))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: {
        elem: 'exp',
        var: 'cons',
        type: {
          elem: 'type',
          name: 'Type',
          params: [{ elem: 'type', name: 'U', params: [] }],
        },
        name: 'Cons',
      },
      arg: { elem: 'exp', var: 'ref', name: 'a' },
    });
  });

  it('parses eval expression of fun', () => {
    const code = 'a: T -> T a b';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: {
        elem: 'exp',
        var: 'fun',
        type: {
          elem: 'type',
          name: 'core::lang::Fun',
          params: [
            { elem: 'type', name: 'T', params: [] },
            { elem: 'type', name: 'T', params: [] },
          ],
        },
        arg: {
          elem: 'def',
          var: 'arg',
          name: 'a',
          type: { elem: 'type', name: 'T', params: [] },
        },
        body: {
          elem: 'exp',
          var: 'ref',
          name: 'a',
        },
      },
      arg: { elem: 'exp', var: 'ref', name: 'b' },
    });
  });

  it('parses grouped eval expression of fun', () => {
    const code = '((a: T -> T a)(b))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: {
        elem: 'exp',
        var: 'fun',
        type: {
          elem: 'type',
          name: 'core::lang::Fun',
          params: [
            { elem: 'type', name: 'T', params: [] },
            { elem: 'type', name: 'T', params: [] },
          ],
        },
        arg: {
          elem: 'def',
          var: 'arg',
          name: 'a',
          type: { elem: 'type', name: 'T', params: [] },
        },
        body: {
          elem: 'exp',
          var: 'ref',
          name: 'a',
        },
      },
      arg: { elem: 'exp', var: 'ref', name: 'b' },
    });
  });

  it('parses eval expression of eval', () => {
    const code = 'a b c';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: {
        elem: 'exp',
        var: 'eval',
        fun: {
          elem: 'exp',
          var: 'ref',
          name: 'a',
        },
        arg: {
          elem: 'exp',
          var: 'ref',
          name: 'b',
        },
      },
      arg: { elem: 'exp', var: 'ref', name: 'c' },
    });
  });

  it('parses grouped eval expression of eval', () => {
    const code = '(a (b c))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'ref', name: 'a' },
      arg: {
        elem: 'exp',
        var: 'eval',
        fun: {
          elem: 'exp',
          var: 'ref',
          name: 'b',
        },
        arg: {
          elem: 'exp',
          var: 'ref',
          name: 'c',
        },
      },
    });
  });

  it('parses grouped eval expression of grouped eval', () => {
    const code = '((a b)(c))';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: {
        elem: 'exp',
        var: 'eval',
        fun: {
          elem: 'exp',
          var: 'ref',
          name: 'a',
        },
        arg: {
          elem: 'exp',
          var: 'ref',
          name: 'b',
        },
      },
      arg: { elem: 'exp', var: 'ref', name: 'c' },
    });
  });

  it('parses type definition', () => {
    const code = 'Type = Cons;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'type',
      name: 'Type',
      params: [],
      vis: 'priv',
      body: [ { elem: 'cons', name: 'Cons', arg: null }],
    });
  });

  it('parses type definition with parameter', () => {
    const code = 'Type<T> = Cons T;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'type',
      name: 'Type',
      params: ['T'],
      vis: 'priv',
      body: [ { elem: 'cons', name: 'Cons', arg: 'T' }],
    });
  });

  it('parses type definition with multiple cons', () => {
    const code = 'Type<U, V> = Cons1 U | Cons2 V;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'type',
      name: 'Type',
      params: ['U', 'V'],
      vis: 'priv',
      body: [
        { elem: 'cons', name: 'Cons1', arg: 'U' },
        { elem: 'cons', name: 'Cons2', arg: 'V' },
      ],
    });
  });

  it('parses public type definition', () => {
    const code = '::Type = Cons;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'type',
      name: 'Type',
      vis: 'pub',
      params: [],
      body: [ { elem: 'cons', name: 'Cons', arg: null }],
    });
  });

  it('parses ref definition of ref', () => {
    const code = 'a = b;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      name: 'a',
      vis: 'priv',
      body: {
        elem: 'exp',
        var: 'ref',
        name: 'b',
      },
    });
  });

  it('parses ref definition of cons', () => {
    const code = 'a = mod::Type<Type1>::Cons;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      name: 'a',
      vis: 'priv',
      body: {
        elem: 'exp',
        var: 'cons',
        type: {
          elem: 'type',
          name: 'mod::Type',
          params: [{ elem: 'type', name: 'Type1', params: [] }],
        },
        name: 'Cons',
      },
    });
  });

  it('parses ref definition of fun', () => {
    const code = 'a = b: Type -> Type c;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      name: 'a',
      vis: 'priv',
      body: {
        elem: 'exp',
        var: 'fun',
        type: {
          elem: 'type',
          name: 'core::lang::Fun',
          params: [
            { elem: 'type', name: 'Type', params: [] },
            { elem: 'type', name: 'Type', params: [] },
          ],
        },
        arg: {
          elem: 'def',
          var: 'arg',
          name: 'b',
          type: { elem: 'type', name: 'Type', params: [] },
        },
        body: { elem: 'exp', var: 'ref', name: 'c' },
      },
    });
  });

  it('parses ref definition of eval', () => {
    const code = 'a = b c;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      name: 'a',
      vis: 'priv',
      body: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'ref', name: 'b' },
        arg: { elem: 'exp', var: 'ref', name: 'c' },
      },
    });
  });

  it('parses public ref definition', () => {
    const code = '::a = b;';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      name: 'a',
      vis: 'pub',
      body: {
        elem: 'exp',
        var: 'ref',
        name: 'b',
      },
    });
  });

  it('parses mod definition with type definition', () => {
    const code = 'mod { Type = Cons1 | Cons2; }';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'mod',
      name: 'mod',
      vis: 'priv',
      body: [
        {
          elem: 'def',
          var: 'type',
          name: 'Type',
          params: [],
          vis: 'priv',
          body: [
            { elem: 'cons', name: 'Cons1', arg: null },
            { elem: 'cons', name: 'Cons2', arg: null },
          ],
        },
      ],
    });
  });

  it('parses mod definition with ref definition', () => {
    const code = 'mod { a = b c; }';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'mod',
      name: 'mod',
      vis: 'priv',
      body: [
        {
          elem: 'def',
          var: 'ref',
          name: 'a',
          vis: 'priv',
          body: {
            elem: 'exp',
            var: 'eval',
            fun: { elem: 'exp', var: 'ref', name: 'b' },
            arg: { elem: 'exp', var: 'ref', name: 'c' },
          },
        },
      ],
    });
  });

  it('parses mod definition with multiple definitions', () => {
    const code = 'mod { ::Type = Cons; a = b c; ::f = a: Type -> Type b; }';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'mod',
      name: 'mod',
      vis: 'priv',
      body: [
        {
          elem: 'def',
          var: 'type',
          name: 'Type',
          params: [],
          vis: 'pub',
          body: [ { elem: 'cons', name: 'Cons', arg: null }],
        },
        {
          elem: 'def',
          var: 'ref',
          name: 'a',
          vis: 'priv',
          body: {
            elem: 'exp',
            var: 'eval',
            fun: { elem: 'exp', var: 'ref', name: 'b' },
            arg: { elem: 'exp', var: 'ref', name: 'c' },
          },
        },
        {
          elem: 'def',
          var: 'ref',
          name: 'f',
          vis: 'pub',
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              name: 'core::lang::Fun',
              params: [
                { elem: 'type', name: 'Type', params: [] },
                { elem: 'type', name: 'Type', params: [] },
              ],
            },
            arg: {
              elem: 'def',
              var: 'arg',
              name: 'a',
              type: { elem: 'type', name: 'Type', params: [] },
            },
            body: { elem: 'exp', var: 'ref', name: 'b' },
          },
        },
      ],
    });
  });

  it('parses mod definition with mod definition', () => {
    const code = '::mod1 { ::mod2 { a = b; } }';
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'mod',
      name: 'mod1',
      vis: 'pub',
      body: [
        {
          elem: 'def',
          var: 'mod',
          name: 'mod2',
          vis: 'pub',
          body: [
            {
              elem: 'def',
              var: 'ref',
              name: 'a',
              vis: 'priv',
              body: { elem: 'exp', var: 'ref', name: 'b' },
            },
          ],
        },
      ],
    });
  });
});

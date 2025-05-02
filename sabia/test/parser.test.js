const { parse } = require('../src/parser');
const Lexer = require('../src/lexer');

describe('parser', () => {
  it('parses enum expression', () => {
    const code = `
      T.A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'enum',
      type: { elem: 'type', var: 'id', id: 'T' },
      body: { elem: 'cons', id: 'A' },
    });
  });

  it('parses id expression', () => {
    const code = `
      a
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'id',
      id: 'a',
    });
  });

  it('parses fqid expression', () => {
    const code = `
      ::a::b
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'id',
      id: '::a::b',
    });
  });

  it('parses ast expression', () => {
    const lexemes = [{ ast: 'ast' }, { scope: -1 }];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ ast: 'ast' });
  });

  it('parses eval expression with single argument', () => {
    const code = `
      f T.A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'f' },
      args: [
        {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: 'T' },
          body: { elem: 'cons', id: 'A' },
        },
      ],
    });
  });

  it('parses eval expression with multiple arguments', () => {
    const code = `
      f T.A T.B
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'f' },
      args: [
        {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: 'T' },
          body: { elem: 'cons', id: 'A' },
        },
        {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: 'T' },
          body: { elem: 'cons', id: 'B' },
        },
      ],
    });
  });

  it('parses eval expression with ast function', () => {
    const lexemes = [{ ast: 'ast' }, 'a', { scope: -1 }];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { ast: 'ast' },
      args: [{ elem: 'exp', var: 'id', id: 'a' }],
    });
  });

  it('parses eval expression with ast arg', () => {
    const lexemes = ['f', { ast: 'ast' }, 'a', { scope: -1 }];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'f' },
      args: [
        { ast: 'ast' },
        { elem: 'exp', var: 'id', id: 'a' },
      ],
    });
  });

  it('parses eval expression with fqid function', () => {
    const code = `
      ::mod::f a
    `;

    const lexemes = Lexer.parse(code);
    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: '::mod::f' },
      args: [{ elem: 'exp', var: 'id', id: 'a' }],
    });
  });

  it('parses eval expression with fqid arg', () => {
    const code = `
      f ::mod::a
    `;

    const lexemes = Lexer.parse(code);
    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'f' },
      args: [{ elem: 'exp', var: 'id', id: '::mod::a' }],
    });
  });

  it('parses multiline eval expression with first arg inline', () => {
    const code = `
      f a
        b
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'f' },
      args: [
        { elem: 'exp', var: 'id', id: 'a' },
        { elem: 'exp', var: 'id', id: 'b' },
      ],
    });
  });

  it('parses multiline eval expression', () => {
    const code = `
      f
        a
        b
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'f' },
      args: [
        { elem: 'exp', var: 'id', id: 'a' },
        { elem: 'exp', var: 'id', id: 'b' },
      ],
    });
  });

  it('parses multiline eval expression with eval arg', () => {
    const code = `
      f
        a
          b
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'f' },
      args: [
        {
          elem: 'exp',
          var: 'eval',
          fun: { elem: 'exp', var: 'id', id: 'a' },
          args: [
            {
              elem: 'exp',
              var: 'id',
              id: 'b'
            },
          ],
        },
      ],
    });
  });

  it('parses function expression with single argument', () => {
    const code = `
      a: A -> b
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      args: [
        {
          elem: 'pat',
          var: 'id',
          id: 'a',
          type: { elem: 'type', var: 'id', id: 'A' },
        },
      ],
      body: { elem: 'exp', var: 'id', id: 'b' },
    });
  });

  it('parses function expression with multiple arguments', () => {
    const code = `
      a: A b: B c: C -> d
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      args: [
        {
          elem: 'pat',
          var: 'id',
          id: 'a',
          type: { elem: 'type', var: 'id', id: 'A' },
        },
        {
          elem: 'pat',
          var: 'id',
          id: 'b',
          type: { elem: 'type', var: 'id', id: 'B' },
        },
        {
          elem: 'pat',
          var: 'id',
          id: 'c',
          type: { elem: 'type', var: 'id', id: 'C' },
        },
      ],
      body: { elem: 'exp', var: 'id', id: 'd' },
    });
  });

  it('parses function expression with eval body', () => {
    const code = `
      a: A -> b c d
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      args: [
        {
          elem: 'pat',
          var: 'id',
          id: 'a',
          type: { elem: 'type', var: 'id', id: 'A' },
        },
      ],
      body: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'id', id: 'b' },
        args: [
          { elem: 'exp', var: 'id', id: 'c' },
          { elem: 'exp', var: 'id', id: 'd' },
        ],
      },
    });
  });

  it('parses multiline function expression with first token inline', () => {
    const code = `
      a: A -> b
        c
        d
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      args: [
        {
          elem: 'pat',
          var: 'id',
          id: 'a',
          type: { elem: 'type', var: 'id', id: 'A' },
        },
      ],
      body: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'id', id: 'b' },
        args: [
          { elem: 'exp', var: 'id', id: 'c' },
          { elem: 'exp', var: 'id', id: 'd' },
        ],
      },
    });
  });

  it('parses multiline function expression', () => {
    const code = `
      a: A ->
        b
          c
          d
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'fun',
      args: [
        {
          elem: 'pat',
          var: 'id',
          id: 'a',
          type: { elem: 'type', var: 'id', id: 'A' },
        },
      ],
      body: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'id', id: 'b' },
        args: [
          { elem: 'exp', var: 'id', id: 'c' },
          { elem: 'exp', var: 'id', id: 'd' },
        ],
      },
    });
  });

  it('parses enum definition with single variant', () => {
    const code = `
      T = A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'enum',
      id: 'T',
      vis: 'priv',
      body: [{ elem: 'cons', id: 'A' }],
    });
  });

  it('parses enum definition with multiple variants', () => {
    const code = `
      T = A | B | C
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'enum',
      id: 'T',
      vis: 'priv',
      body: [
        { elem: 'cons', id: 'A' },
        { elem: 'cons', id: 'B' },
        { elem: 'cons', id: 'C' },
      ],
    });
  });

  it('parses definition of reference to enum value', () => {
    const code = `
      a = T.A
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      id: 'a',
      vis: 'priv',
      body: {
        elem: 'exp',
        var: 'enum',
        type: { elem: 'type', var: 'id', id: 'T' },
        body: { elem: 'cons', id: 'A' },
      },
    });
  });

  it('parses definition of reference to function value', () => {
    const code = `
      a = a: A -> b
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      id: 'a',
      vis: 'priv',
      body: {
        elem: 'exp',
        var: 'fun',
        args: [
          {
            elem: 'pat',
            var: 'id',
            id: 'a',
            type: { elem: 'type', var: 'id', id: 'A' },
          },
        ],
        body: { elem: 'exp', var: 'id', id: 'b' },
      },
    });
  });

  it('parses definition of reference to multiline function value', () => {
    const code = `
      f = a: A ->
        b
          c
          d
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      id: 'f',
      vis: 'priv',
      body: {
        elem: 'exp',
        var: 'fun',
        args: [
          {
            elem: 'pat',
            var: 'id',
            id: 'a',
            type: { elem: 'type', var: 'id', id: 'A' },
          },
        ],
        body: {
          elem: 'exp',
          var: 'eval',
          fun: { elem: 'exp', var: 'id', id: 'b' },
          args: [
            { elem: 'exp', var: 'id', id: 'c' },
            { elem: 'exp', var: 'id', id: 'd' },
          ],
        },
      },
    });
  });

  it('parses definition of reference to ast', () => {
    const lexemes = ['a', '=', { ast: 'ast' }, { scope: -1 }];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      id: 'a',
      vis: 'priv',
      body: { ast: 'ast' },
    });
  });

  it('parses definition of reference to fqid', () => {
    const code = `
      a = ::a::b
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      id: 'a',
      vis: 'priv',
      body: { elem: 'exp', var: 'id', id: '::a::b' },
    });
  });

  it('parses public definition', () => {
    const code = `
      ::A = A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'enum',
      id: 'A',
      vis: 'pub',
      body: [{ elem: 'cons', id: 'A' }],
    });
  });

  it('parses single def mod definition', () => {
    const code = `
      ::_ =
        a = ::ax
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'mod',
      id: '_',
      body: [
        {
          elem: 'def',
          var: 'ref',
          id: 'a',
          vis: 'priv',
          body: { elem: 'exp', var: 'id', id: '::ax' },
        },
      ],
    });
  });

  it('parses multiple def mod definition', () => {
    const code = `
      ::_ =
        a = ::ax
        b = ::bx

        ::C = C
        ::d = d: D -> d e
        e = E.E
        f = F.F
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'mod',
      id: '_',
      body: [
        {
          elem: 'def',
          var: 'ref',
          id: 'a',
          vis: 'priv',
          body: { elem: 'exp', var: 'id', id: '::ax' },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'b',
          vis: 'priv',
          body: { elem: 'exp', var: 'id', id: '::bx' },
        },
        {
          elem: 'def',
          var: 'enum',
          id: 'C',
          vis: 'pub',
          body: [{ elem: 'cons', id: 'C' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'd',
          vis: 'pub',
          body: {
            elem: 'exp',
            var: 'fun',
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: 'd',
                type: { elem: 'type', var: 'id', id: 'D' },
              },
            ],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: {
                elem: 'exp',
                var: 'id',
                id: 'd',
              },
              args: [{ elem: 'exp', var: 'id', id: 'e' }],
            },
          },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'e',
          vis: 'priv',
          body: {
            elem: 'exp',
            var: 'enum',
            type: { elem: 'type', var: 'id', id: 'E' },
            body: { elem: 'cons', id: 'E' },
          },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          body: {
            elem: 'exp',
            var: 'enum',
            type: { elem: 'type', var: 'id', id: 'F' },
            body: { elem: 'cons', id: 'F' },
          },
        },
      ],
    });
  });

  it('parses multiline def mod definition', () => {
    const code = `
      ::_ =
        f = _: ::A ->
          ::b
            c
            d
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'mod',
      id: '_',
      body: [
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          body: {
            elem: 'exp',
            var: 'fun',
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '_',
                type: { elem: 'type', var: 'id', id: '::A' },
              },
            ],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: { elem: 'exp', var: 'id', id: '::b' },
              args: [
                { elem: 'exp', var: 'id', id: 'c' },
                { elem: 'exp', var: 'id', id: 'd' },
              ],
            },
          },
        },
      ],
    });
  });
});

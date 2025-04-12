const { parse } = require('../src/parser');
const Lexer = require('../src/lexer');

describe('parser', () => {
  it('parses identifier expression', () => {
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

  it('parses ast expression', () => {
    const lexemes = [{ ast: 'ast' }];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({ ast: 'ast' });
  });

  it('parses evaluation expression with single argument', () => {
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

  it('parses evaluation expression with multiple arguments', () => {
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

  it('parses evaluation expression with ast function', () => {
    const lexemes = [{ ast: 'ast' }, 'a'];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { ast: 'ast' },
      args: [{ elem: 'exp', var: 'id', id: 'a' }],
    });
  });

  it('parses evaluation expression with ast arg', () => {
    const lexemes = ['f', { ast: 'ast' }, 'a'];

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

  it('parses function expression with evaluation body', () => {
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

  it('parses definition of reference to ast', () => {
    const lexemes = ['a', '=', { ast: 'ast' }];

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'ref',
      id: 'a',
      vis: 'priv',
      body: { ast: 'ast' },
    });
  });

  it('parses definition of reference to external reference', () => {
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
      body: { elem: 'ext', id: '::a::b' },
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

  it('parses module definition with single definition', () => {
    const code = `
      ::_
        T = A
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'enum',
          id: 'T',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
      ],
    });
  });

  it('parses module definition', () => {
    const code = `
      ::a
        a = ::ax
        b = ::bx

        ::C = C
        ::d = d: D -> d
        e = E.E
        f = F.F
    `;

    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'mod',
      id: '::a',
      body: [
        {
          elem: 'def',
          var: 'ref',
          id: 'a',
          vis: 'priv',
          body: { elem: 'ext', id: '::ax' },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'b',
          vis: 'priv',
          body: { elem: 'ext', id: '::bx' },
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
            body: { elem: 'exp', var: 'id', id: 'd' },
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
});

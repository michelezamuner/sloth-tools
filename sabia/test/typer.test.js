const { type } = require('../src/typer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser/group');
const Indexer = require('../src/indexer');

describe('typer', () => {
  it('type enum expression', () => {
    const code = `
      ::_
        T = A
        a = T.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::T': {
        elem: 'def',
        var: 'enum',
        id: '::_::T',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::a': {
        elem: 'def',
        var: 'ref',
        id: '::_::a',
        type: { elem: 'type', var: 'id', id: '::_::T' },
        body: {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          body: { elem: 'cons', id: 'A' },
        },
      },
    });
  });

  it('type id expression', () => {
    const code = `
      ::_
        T = A
        a = T.A
        b = a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::T': {
        elem: 'def',
        var: 'enum',
        id: '::_::T',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::a': {
        elem: 'def',
        var: 'ref',
        id: '::_::a',
        type: { elem: 'type', var: 'id', id: '::_::T' },
        body: {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          body: { elem: 'cons', id: 'A' },
        },
      },
      '::_::b': {
        elem: 'def',
        var: 'ref',
        id: '::_::b',
        type: { elem: 'type', var: 'id', id: '::_::T' },
        body: {
          elem: 'exp',
          var: 'id',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          id: '::_::a',
        },
      },
    });
  });

  it('type function expression with enum body', () => {
    const code = `
      ::_
        T1 = A
        T2 = A
        f = a: T1 b: T2 -> T2.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::T1': {
        elem: 'def',
        var: 'enum',
        id: '::_::T1',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::T2': {
        elem: 'def',
        var: 'enum',
        id: '::_::T2',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        type: {
          elem: 'type',
          var: 'fun',
          args: [
            { elem: 'type', var: 'id', id: '::_::T1' },
            { elem: 'type', var: 'id', id: '::_::T2' }
          ],
          ret: { elem: 'type', var: 'id', id: '::_::T2' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [
              { elem: 'type', var: 'id', id: '::_::T1' },
              { elem: 'type', var: 'id', id: '::_::T2' }
            ],
            ret: { elem: 'type', var: 'id', id: '::_::T2' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::T1' },
            },
            {
              elem: 'pat',
              var: 'id',
              id: '::_::b',
              type: { elem: 'type', var: 'id', id: '::_::T2' },
            },
          ],
          body: {
            elem: 'exp',
            var: 'enum',
            type: { elem: 'type', var: 'id', id: '::_::T2' },
            body: { elem: 'cons', id: 'A' },
          },
          ctx: {
            '::_::a': {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::T1' },
            },
            '::_::b': {
              elem: 'pat',
              var: 'id',
              id: '::_::b',
              type: { elem: 'type', var: 'id', id: '::_::T2' },
            },
          },
        },
      },
    });
  });

  it('type function expression with id body', () => {
    const code = `
      ::_
        T = A
        a = T.A
        b = a
        f = a: T -> b
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::T': {
        elem: 'def',
        var: 'enum',
        id: '::_::T',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::a': {
        elem: 'def',
        var: 'ref',
        id: '::_::a',
        type: { elem: 'type', var: 'id', id: '::_::T' },
        body: {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          body: { elem: 'cons', id: 'A' },
        },
      },
      '::_::b': {
        elem: 'def',
        var: 'ref',
        id: '::_::b',
        type: { elem: 'type', var: 'id', id: '::_::T' },
        body: {
          elem: 'exp',
          var: 'id',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          id: '::_::a',
        },
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'id', id: '::_::T' }],
          ret: { elem: 'type', var: 'id', id: '::_::T' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '::_::T' }],
            ret: { elem: 'type', var: 'id', id: '::_::T' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::T' },
            }
          ],
          body: {
            elem: 'exp',
            var: 'id',
            type: { elem: 'type', var: 'id', id: '::_::T' },
            id: '::_::b',
          },
          ctx: {
            '::_::a': {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::T' },
            }
          },
        },
      },
    });
  });

  it('type function expression with arg body', () => {
    const code = `
      ::_
        T = A
        f = a: T -> a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::T': {
        elem: 'def',
        var: 'enum',
        id: '::_::T',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'id', id: '::_::T' }],
          ret: { elem: 'type', var: 'id', id: '::_::T' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '::_::T' }],
            ret: { elem: 'type', var: 'id', id: '::_::T' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::T' },
            }
          ],
          body: {
            elem: 'exp',
            var: 'id',
            type: { elem: 'type', var: 'id', id: '::_::T' },
            id: '::_::a',
          },
          ctx: {
            '::_::a': {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::T' },
            },
          },
        },
      },
    });
  });

  it('type function expression with arg eval body', () => {
    const code = `
      ::_
        A = A
        B = B
        f = _: A -> B.B
        g = a: A -> f a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::A': {
        elem: 'def',
        var: 'enum',
        id: '::_::A',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::B': {
        elem: 'def',
        var: 'enum',
        id: '::_::B',
        body: [{ elem: 'cons', id: 'B' }],
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'id', id: '::_::A' }],
          ret: { elem: 'type', var: 'id', id: '::_::B' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '::_::A' }],
            ret: { elem: 'type', var: 'id', id: '::_::B' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::_',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            }
          ],
          body: {
            elem: 'exp',
            var: 'enum',
            type: { elem: 'type', var: 'id', id: '::_::B' },
            body: { elem: 'cons', id: 'B' },
          },
          ctx: {
            '::_::_': {
              elem: 'pat',
              var: 'id',
              id: '::_::_',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            },
          },
        },
      },
      '::_::g': {
        elem: 'def',
        var: 'ref',
        id: '::_::g',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'id', id: '::_::A' }],
          ret: { elem: 'type', var: 'id', id: '::_::B' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '::_::A' }],
            ret: { elem: 'type', var: 'id', id: '::_::B' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            }
          ],
          body: {
            elem: 'exp',
            var: 'eval',
            fun: {
              elem: 'exp',
              var: 'id',
              id: '::_::f',
              type: {
                elem: 'type',
                var: 'fun',
                args: [{ elem: 'type', var: 'id', id: '::_::A' }],
                ret: { elem: 'type', var: 'id', id: '::_::B' },
              },
            },
            type: { elem: 'type', var: 'id', id: '::_::B' },
            args: [
              {
                elem: 'exp',
                var: 'id',
                type: { elem: 'type', var: 'id', id: '::_::A' },
                id: '::_::a',
              },
            ],
          },
          ctx: {
            '::_::a': {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            },
          },
        },
      },
    });
  });

  it('type eval expression', () => {
    const code = `
      ::_
        T = A
        a = (a: T -> a) T.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::T': {
        elem: 'def',
        var: 'enum',
        id: '::_::T',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::a': {
        elem: 'def',
        var: 'ref',
        id: '::_::a',
        type: { elem: 'type', var: 'id', id: '::_::T' },
        body: {
          elem: 'exp',
          var: 'eval',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          fun: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [
                { elem: 'type', var: 'id', id: '::_::T' },
              ],
              ret: { elem: 'type', var: 'id', id: '::_::T' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '::_::a',
                type: { elem: 'type', var: 'id', id: '::_::T' },
              },
            ],
            body: {
              elem: 'exp',
              var: 'id',
              type: { elem: 'type', var: 'id', id: '::_::T' },
              id: '::_::a'
            },
            ctx: {
              '::_::a': {
                elem: 'pat',
                var: 'id',
                id: '::_::a',
                type: { elem: 'type', var: 'id', id: '::_::T' },
              },
            },
          },
          args: [
            {
              elem: 'exp',
              var: 'enum',
              type: { elem: 'type', var: 'id', id: '::_::T' },
              body: { elem: 'cons', id: 'A' },
            },
          ],
        },
      },
    });
  });

  it('type function expression with ext enum eval body', () => {
    const code = `
      ::_
        dbg = ::core::lang::debug
        A = A
        f = _: A -> dbg A.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::dbg': {
        elem: 'def',
        var: 'ref',
        id: '::_::dbg',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
          ret: { elem: 'type', var: 'gen', gen: '<T>' },
        },
        body: {
          elem: 'ext',
          id: '::core::lang::debug',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
            ret: { elem: 'type', var: 'gen', gen: '<T>' },
          },
        },
      },
      '::_::A': {
        elem: 'def',
        var: 'enum',
        id: '::_::A',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'id', id: '::_::A' }],
          ret: { elem: 'type', var: 'id', id: '::_::A' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '::_::A' }],
            ret: { elem: 'type', var: 'id', id: '::_::A' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::_',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            }
          ],
          body: {
            elem: 'exp',
            var: 'eval',
            fun: {
              elem: 'exp',
              var: 'id',
              id: '::_::dbg',
              type: {
                elem: 'type',
                var: 'fun',
                args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
                ret: { elem: 'type', var: 'gen', gen: '<T>' },
              },
            },
            type: { elem: 'type', var: 'id', id: '::_::A' },
            args: [
              {
                elem: 'exp',
                var: 'enum',
                type: { elem: 'type', var: 'id', id: '::_::A' },
                body: { elem: 'cons', id: 'A' },
              },
            ],
          },
          ctx: {
            '::_::_': {
              elem: 'pat',
              var: 'id',
              id: '::_::_',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            },
          },
        },
      },
    });
  });

  it('type function expression with ext arg eval body', () => {
    const code = `
      ::_
        dbg = ::core::lang::debug
        A = A
        f = a: A -> dbg a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::dbg': {
        elem: 'def',
        var: 'ref',
        id: '::_::dbg',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
          ret: { elem: 'type', var: 'gen', gen: '<T>' },
        },
        body: {
          elem: 'ext',
          id: '::core::lang::debug',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
            ret: { elem: 'type', var: 'gen', gen: '<T>' },
          },
        },
      },
      '::_::A': {
        elem: 'def',
        var: 'enum',
        id: '::_::A',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'id', id: '::_::A' }],
          ret: { elem: 'type', var: 'id', id: '::_::A' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '::_::A' }],
            ret: { elem: 'type', var: 'id', id: '::_::A' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            }
          ],
          body: {
            elem: 'exp',
            var: 'eval',
            fun: {
              elem: 'exp',
              var: 'id',
              id: '::_::dbg',
              type: {
                elem: 'type',
                var: 'fun',
                args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
                ret: { elem: 'type', var: 'gen', gen: '<T>' },
              },
            },
            type: { elem: 'type', var: 'id', id: '::_::A' },
            args: [
              {
                elem: 'exp',
                var: 'id',
                type: { elem: 'type', var: 'id', id: '::_::A' },
                id: '::_::a',
              },
            ],
          },
          ctx: {
            '::_::a': {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            },
          },
        },
      },
    });
  });

  it('type function expression with ext ref eval body', () => {
    const code = `
      ::_
        dbg = ::core::lang::debug
        A = A
        a = A.A
        f = _: A -> dbg a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const rawIndex = Indexer.index(ast);

    const index = type(rawIndex);

    expect(index).toStrictEqual({
      '::_::dbg': {
        elem: 'def',
        var: 'ref',
        id: '::_::dbg',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
          ret: { elem: 'type', var: 'gen', gen: '<T>' },
        },
        body: {
          elem: 'ext',
          id: '::core::lang::debug',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
            ret: { elem: 'type', var: 'gen', gen: '<T>' },
          },
        },
      },
      '::_::A': {
        elem: 'def',
        var: 'enum',
        id: '::_::A',
        body: [{ elem: 'cons', id: 'A' }],
      },
      '::_::a': {
        elem: 'def',
        var: 'ref',
        id: '::_::a',
        type: { elem: 'type', var: 'id', id: '::_::A' },
        body: {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: '::_::A' },
          body: { elem: 'cons', id: 'A' },
        },
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        type: {
          elem: 'type',
          var: 'fun',
          args: [{ elem: 'type', var: 'id', id: '::_::A' }],
          ret: { elem: 'type', var: 'id', id: '::_::A' },
        },
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '::_::A' }],
            ret: { elem: 'type', var: 'id', id: '::_::A' },
          },
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::_',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            },
          ],
          body: {
            elem: 'exp',
            var: 'eval',
            fun: {
              elem: 'exp',
              var: 'id',
              id: '::_::dbg',
              type: {
                elem: 'type',
                var: 'fun',
                args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
                ret: { elem: 'type', var: 'gen', gen: '<T>' },
              },
            },
            type: { elem: 'type', var: 'id', id: '::_::A' },
            args: [
              {
                elem: 'exp',
                var: 'id',
                type: { elem: 'type', var: 'id', id: '::_::A' },
                id: '::_::a',
              },
            ],
          },
          ctx: {
            '::_::_': {
              elem: 'pat',
              var: 'id',
              id: '::_::_',
              type: { elem: 'type', var: 'id', id: '::_::A' },
            },
          },
        },
      },
    });
  });
});

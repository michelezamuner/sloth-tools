const { type } = require('../src/typer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser');
const Indexer = require('../src/indexer');

describe('typer', () => {
  it('adds type to function arguments', () => {
    const code = `
      ::_
        A = B
        C = D
        f = a: A b: A -> C.D
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'B' }],
        },
        {
          elem: 'def',
          var: 'enum',
          id: 'C',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'D' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [
              { elem: 'type', var: 'id', id: 'A' },
              { elem: 'type', var: 'id', id: 'A' }
            ],
            ret: { elem: 'type', var: 'id', id: 'C' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [
                { elem: 'type', var: 'id', id: 'A' },
                { elem: 'type', var: 'id', id: 'A' }
              ],
              ret: { elem: 'type', var: 'id', id: 'C' },
            },
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
                type: { elem: 'type', var: 'id', id: 'A' },
              },
            ],
            body: {
              elem: 'exp',
              var: 'enum',
              type: { elem: 'type', var: 'id', id: 'C' },
              body: { elem: 'cons', id: 'D' },
            },
          },
        },
      ],
    });
  });

  it('adds type to argument reference expression', () => {
    const code = `
      ::_
        A = A
        f = a: A -> a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: 'A' }],
            ret: { elem: 'type', var: 'id', id: 'A' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: 'A' }],
              ret: { elem: 'type', var: 'id', id: 'A' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: 'a',
                type: { elem: 'type', var: 'id', id: 'A' },
              }
            ],
            body: {
              elem: 'exp',
              var: 'id',
              type: { elem: 'type', var: 'id', id: 'A' },
              id: 'a',
            },
          },
        },
      ],
    });
  });

  it('adds type to id reference expression', () => {
    const code = `
      ::_
        A = A
        a = A.A
        b = a
        f = _: _ -> b
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'a',
          vis: 'priv',
          type: { elem: 'type', var: 'id', id: 'A' },
          body: {
            elem: 'exp',
            var: 'enum',
            type: { elem: 'type', var: 'id', id: 'A' },
            body: { elem: 'cons', id: 'A' },
          },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'b',
          vis: 'priv',
          type: { elem: 'type', var: 'id', id: 'A' },
          body: {
            elem: 'exp',
            var: 'id',
            type: { elem: 'type', var: 'id', id: 'A' },
            id: 'a',
          },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '_' }],
            ret: { elem: 'type', var: 'id', id: 'A' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: '_' }],
              ret: { elem: 'type', var: 'id', id: 'A' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '_',
                type: { elem: 'type', var: 'id', id: '_' },
              }
            ],
            body: {
              elem: 'exp',
              var: 'id',
              type: { elem: 'type', var: 'id', id: 'A' },
              id: 'b',
            },
          },
        },
      ],
    });
  });

  it('adds type to enum evaluation expression', () => {
    const code = `
      ::_
        A = A
        B = B
        f1 = _: _ -> B.B
        f2 = _: A -> f1 A.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'enum',
          id: 'B',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'B' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f1',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '_' }],
            ret: { elem: 'type', var: 'id', id: 'B' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: '_' }],
              ret: { elem: 'type', var: 'id', id: 'B' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '_',
                type: { elem: 'type', var: 'id', id: '_' },
              },
            ],
            body: {
              elem: 'exp',
              var: 'enum',
              type: { elem: 'type', var: 'id', id: 'B' },
              body: { elem: 'cons', id: 'B' },
            },
          },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f2',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: 'A' }],
            ret: { elem: 'type', var: 'id', id: 'B' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: 'A' }],
              ret: { elem: 'type', var: 'id', id: 'B' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '_',
                type: { elem: 'type', var: 'id', id: 'A' },
              },
            ],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: {
                elem: 'exp',
                var: 'id',
                id: 'f1',
                type: {
                  elem: 'type',
                  var: 'fun',
                  args: [{ elem: 'type', var: 'id', id: '_' }],
                  ret: { elem: 'type', var: 'id', id: 'B' },
                },
              },
              type: { elem: 'type', var: 'id', id: 'B' },
              args: [
                {
                  elem: 'exp',
                  var: 'enum',
                  type: { elem: 'type', var: 'id', id: 'A' },
                  body: { elem: 'cons', id: 'A' },
                },
              ],
            },
          },
        },
      ],
    });
  });

  it('adds type to argument evaluation expression', () => {
    const code = `
      ::_
        A = A
        B = B
        f = _: A -> B.B
        g = a: A -> f a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'enum',
          id: 'B',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'B' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: 'A' }],
            ret: { elem: 'type', var: 'id', id: 'B' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: 'A' }],
              ret: { elem: 'type', var: 'id', id: 'B' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '_',
                type: { elem: 'type', var: 'id', id: 'A' },
              }
            ],
            body: {
              elem: 'exp',
              var: 'enum',
              type: { elem: 'type', var: 'id', id: 'B' },
              body: { elem: 'cons', id: 'B' },
            },
          },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'g',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: 'A' }],
            ret: { elem: 'type', var: 'id', id: 'B' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: 'A' }],
              ret: { elem: 'type', var: 'id', id: 'B' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: 'a',
                type: { elem: 'type', var: 'id', id: 'A' },
              }
            ],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: {
                elem: 'exp',
                var: 'id',
                id: 'f',
                type: {
                  elem: 'type',
                  var: 'fun',
                  args: [{ elem: 'type', var: 'id', id: 'A' }],
                  ret: { elem: 'type', var: 'id', id: 'B' },
                },
              },
              type: { elem: 'type', var: 'id', id: 'B' },
              args: [
                {
                  elem: 'exp',
                  var: 'id',
                  type: { elem: 'type', var: 'id', id: 'A' },
                  id: 'a',
                },
              ],
            },
          },
        },
      ],
    });
  });

  it('adds type to argument evaluation with external definition calling enum', () => {
    const code = `
      ::_
        dbg = ::core::lang::debug
        A = A
        f = _: _ -> dbg A.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'ref',
          id: 'dbg',
          vis: 'priv',
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
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '_' }],
            ret: { elem: 'type', var: 'id', id: 'A' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: '_' }],
              ret: { elem: 'type', var: 'id', id: 'A' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '_',
                type: { elem: 'type', var: 'id', id: '_' },
              }
            ],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: {
                elem: 'exp',
                var: 'id',
                id: 'dbg',
                type: {
                  elem: 'type',
                  var: 'fun',
                  args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
                  ret: { elem: 'type', var: 'gen', gen: '<T>' },
                },
              },
              type: { elem: 'type', var: 'id', id: 'A' },
              args: [
                {
                  elem: 'exp',
                  var: 'enum',
                  type: { elem: 'type', var: 'id', id: 'A' },
                  body: { elem: 'cons', id: 'A' },
                },
              ],
            },
          },
        },
      ],
    });
  });

  it('adds type to argument evaluation with external definition calling argument', () => {
    const code = `
      ::_
        dbg = ::core::lang::debug
        A = A
        f = a: A -> dbg a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'ref',
          id: 'dbg',
          vis: 'priv',
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
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: 'A' }],
            ret: { elem: 'type', var: 'id', id: 'A' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: 'A' }],
              ret: { elem: 'type', var: 'id', id: 'A' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: 'a',
                type: { elem: 'type', var: 'id', id: 'A' },
              }
            ],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: {
                elem: 'exp',
                var: 'id',
                id: 'dbg',
                type: {
                  elem: 'type',
                  var: 'fun',
                  args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
                  ret: { elem: 'type', var: 'gen', gen: '<T>' },
                },
              },
              type: { elem: 'type', var: 'id', id: 'A' },
              args: [
                {
                  elem: 'exp',
                  var: 'id',
                  type: { elem: 'type', var: 'id', id: 'A' },
                  id: 'a',
                },
              ],
            },
          },
        },
      ],
    });
  });

  it('adds type to argument evaluation with external definition calling ref', () => {
    const code = `
      ::_
        dbg = ::core::lang::debug
        A = A
        a = A.A
        f = _: _ -> dbg a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst).toStrictEqual({
      elem: 'mod',
      id: '::_',
      body: [
        {
          elem: 'def',
          var: 'ref',
          id: 'dbg',
          vis: 'priv',
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
        {
          elem: 'def',
          var: 'enum',
          id: 'A',
          vis: 'priv',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'a',
          vis: 'priv',
          type: { elem: 'type', var: 'id', id: 'A' },
          body: {
            elem: 'exp',
            var: 'enum',
            type: { elem: 'type', var: 'id', id: 'A' },
            body: { elem: 'cons', id: 'A' },
          },
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'f',
          vis: 'priv',
          type: {
            elem: 'type',
            var: 'fun',
            args: [{ elem: 'type', var: 'id', id: '_' }],
            ret: { elem: 'type', var: 'id', id: 'A' },
          },
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: '_' }],
              ret: { elem: 'type', var: 'id', id: 'A' },
            },
            args: [
              {
                elem: 'pat',
                var: 'id',
                id: '_',
                type: { elem: 'type', var: 'id', id: '_' },
              }
            ],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: {
                elem: 'exp',
                var: 'id',
                id: 'dbg',
                type: {
                  elem: 'type',
                  var: 'fun',
                  args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
                  ret: { elem: 'type', var: 'gen', gen: '<T>' },
                },
              },
              type: { elem: 'type', var: 'id', id: 'A' },
              args: [
                {
                  elem: 'exp',
                  var: 'id',
                  type: { elem: 'type', var: 'id', id: 'A' },
                  id: 'a',
                },
              ],
            },
          },
        },
      ],
    });
  });
});

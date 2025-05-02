const { index } = require('../src/indexer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser/group');

describe('indexer', () => {
  it('indexes enum definition', () => {
    const code = `
      ::_ =
        T = A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      '::_::T': {
        elem: 'def',
        var: 'enum',
        id: '::_::T',
        body: [{ elem: 'cons', id: 'A' }],
      },
    });
  });

  it('indexes enum expression', () => {
    const code = `
      ::_ =
        T = A
        a = T.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
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
        body: {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          body: { elem: 'cons', id: 'A' },
        },
      },
    });
  });

  it('indexes id expression', () => {
    const code = `
      ::_ =
        T = A
        a = T.A
        b = a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
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
        body: {
          elem: 'exp',
          var: 'id',
          id: '::_::a',
        },
      },
    });
  });

  it('indexes id expression of fqid', () => {
    const code = `
      ::_ =
        a = ::a::b
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      '::_::a': {
        elem: 'def',
        var: 'ref',
        id: '::_::a',
        body: {
          elem: 'exp',
          var: 'id',
          id: '::a::b',
        },
      },
    });
  });

  it('indexes function expression with enum body', () => {
    const code = `
      ::_ =
        T = A
        f = a: T -> T.A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
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
        body: {
          elem: 'exp',
          var: 'fun',
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
            var: 'enum',
            type: { elem: 'type', var: 'id', id: '::_::T' },
            body: { elem: 'cons', id: 'A' },
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
      }
    });
  });

  it('indexes function expression with id body', () => {
    const code = `
      ::_ =
        T = A
        a = T.A
        f = b: T -> a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
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
        body: {
          elem: 'exp',
          var: 'enum',
          type: { elem: 'type', var: 'id', id: '::_::T' },
          body: { elem: 'cons', id: 'A' },
        },
      },
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        body: {
          elem: 'exp',
          var: 'fun',
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::b',
              type: { elem: 'type', var: 'id', id: '::_::T' },
            },
          ],
          body: {
            elem: 'exp',
            var: 'id',
            id: '::_::a'
          },
          ctx: {
            '::_::b': {
              elem: 'pat',
              var: 'id',
              id: '::_::b',
              type: { elem: 'type', var: 'id', id: '::_::T' },
            },
          },
        },
      }
    });
  });

  it('indexes function expression with arg body', () => {
    const code = `
      ::_ =
        T = A
        f = a: T -> a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
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
        body: {
          elem: 'exp',
          var: 'fun',
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
      }
    });
  });

  it('indexes function expression with eval body', () => {
    const code = `
      ::_ =
        T = A
        f = a: T -> (b: T -> b) a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
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
        body: {
          elem: 'exp',
          var: 'fun',
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
            var: 'eval',
            fun: {
              elem: 'exp',
              var: 'fun',
              args: [
                {
                  elem: 'pat',
                  var: 'id',
                  id: '::_::b',
                  type: { elem: 'type', var: 'id', id: '::_::T' },
                },
              ],
              body: { elem: 'exp', var: 'id', id: '::_::b' },
              ctx: {
                '::_::a': {
                  elem: 'pat',
                  var: 'id',
                  id: '::_::a',
                  type: { elem: 'type', var: 'id', id: '::_::T' },
                },
                '::_::b': {
                  elem: 'pat',
                  var: 'id',
                  id: '::_::b',
                  type: { elem: 'type', var: 'id', id: '::_::T' },
                },
              },
            },
            args: [{ elem: 'exp', var: 'id', id: '::_::a' }],
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

  it('indexes function expression with fqid arg and body', () => {
    const code = `
      ::_ =
        f = a: ::a::b::C -> ::a::b::c
          ::a::b::d
          ::a::b::e
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const _index = index(ast);

    expect(_index).toStrictEqual({
      '::_::f': {
        elem: 'def',
        var: 'ref',
        id: '::_::f',
        body: {
          elem: 'exp',
          var: 'fun',
          args: [
            {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::a::b::C' },
            },
          ],
          body: {
            elem: 'exp',
            var: 'eval',
            fun: {
              elem: 'exp',
              var: 'id',
              id: '::a::b::c',
            },
            args: [
              { elem: 'exp', var: 'id', id: '::a::b::d' },
              { elem: 'exp', var: 'id', id: '::a::b::e' },
            ],
          },
          ctx: {
            '::_::a': {
              elem: 'pat',
              var: 'id',
              id: '::_::a',
              type: { elem: 'type', var: 'id', id: '::a::b::C' },
            },
          },
        },
      },
    });
  });
});

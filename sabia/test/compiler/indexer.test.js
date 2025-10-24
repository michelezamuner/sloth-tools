const { index } = require('../../src/compiler/indexer');
const Frontend = require('../../src/frontends/anath/frontend');

describe('indexer', () => {
  it('indexes type definition', () => {
    const code = 'T<U, V> = A U | B V;';
    const ast = Frontend.parse(code);

    const result = index(ast);

    expect(result).toStrictEqual({
      'app::T': {
        elem: 'def',
        var: 'type',
        name: 'app::T',
        params: [
          { elem: 'type', name: 'U', params: [] },
          { elem: 'type', name: 'V', params: [] },
        ],
        vis: 'priv',
        body: [
          {
            elem: 'cons',
            name: 'A',
            arg: { elem: 'type', name: 'U', params: [] },
          },
          {
            elem: 'cons',
            name: 'B',
            arg: { elem: 'type', name: 'V', params: [] },
          },
        ],
      },
      'app::main': {
        elem: 'def',
        var: 'ref',
        name: 'app::main',
        vis: 'pub',
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            name: 'core::lang::Fun',
            params: [
              { elem: 'type', name: 'std::sys::Proc', params: [] },
              { elem: 'type', name: 'std::sys::Exit', params: [] },
            ]
          },
          arg: {
            elem: 'def',
            var: 'arg',
            name: 'p',
            type: { elem: 'type', name: 'std::sys::Proc', params: [] },
          },
          body: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'std::sys::Exit', params: [] },
            name: 'Ok',
          },
          ctx: {
            p: {
              elem: 'def',
              var: 'arg',
              name: 'p',
              type: { elem: 'type', name: 'std::sys::Proc', params: [] },
            }
          },
        },
      },
    });
  });

  it('indexes ref definition of ref', () => {
    const code = 'a = then; b = a;';
    const ast = Frontend.parse(code);

    const result = index(ast);

    expect(result).toStrictEqual({
      'app::a': {
        elem: 'def',
        var: 'ref',
        name: 'app::a',
        vis: 'priv',
        body: { elem: 'exp', var: 'ref', name: 'core::lang::then' },
      },
      'app::b': {
        elem: 'def',
        var: 'ref',
        name: 'app::b',
        vis: 'priv',
        body: { elem: 'exp', var: 'ref', name: 'app::a' },
      },
      'app::main': {
        elem: 'def',
        var: 'ref',
        name: 'app::main',
        vis: 'pub',
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            name: 'core::lang::Fun',
            params: [
              { elem: 'type', name: 'std::sys::Proc', params: [] },
              { elem: 'type', name: 'std::sys::Exit', params: [] },
            ]
          },
          arg: {
            elem: 'def',
            var: 'arg',
            name: 'p',
            type: { elem: 'type', name: 'std::sys::Proc', params: [] },
          },
          body: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'std::sys::Exit', params: [] },
            name: 'Ok',
          },
          ctx: {
            p: {
              elem: 'def',
              var: 'arg',
              name: 'p',
              type: { elem: 'type', name: 'std::sys::Proc', params: [] },
            }
          },
        },
      },
    });
  });

  it('indexes ref definition of cons', () => {
    const code = 'T = A; b = T::A;';
    const ast = Frontend.parse(code);

    const result = index(ast);

    expect(result).toStrictEqual({
      'app::T': {
        elem: 'def',
        var: 'type',
        name: 'app::T',
        params: [],
        vis: 'priv',
        body: [{ elem: 'cons', name: 'A', arg: null }],
      },
      'app::b': {
        elem: 'def',
        var: 'ref',
        name: 'app::b',
        vis: 'priv',
        body: {
          elem: 'exp',
          var: 'cons',
          type: { elem: 'type', name: 'app::T', params: [] },
          name: 'A',
        },
      },
      'app::main': {
        elem: 'def',
        var: 'ref',
        name: 'app::main',
        vis: 'pub',
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            name: 'core::lang::Fun',
            params: [
              { elem: 'type', name: 'std::sys::Proc', params: [] },
              { elem: 'type', name: 'std::sys::Exit', params: [] },
            ]
          },
          arg: {
            elem: 'def',
            var: 'arg',
            name: 'p',
            type: { elem: 'type', name: 'std::sys::Proc', params: [] },
          },
          body: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'std::sys::Exit', params: [] },
            name: 'Ok',
          },
          ctx: {
            p: {
              elem: 'def',
              var: 'arg',
              name: 'p',
              type: { elem: 'type', name: 'std::sys::Proc', params: [] },
            }
          },
        },
      },
    });
  });

  it('indexes ref definition of eval of ref', () => {
    const code = 'a = then; b = a then;';
    const ast = Frontend.parse(code);

    const result = index(ast);

    expect(result).toStrictEqual({
      'app::a': {
        elem: 'def',
        var: 'ref',
        name: 'app::a',
        vis: 'priv',
        body: { elem: 'exp', var: 'ref', name: 'core::lang::then' },
      },
      'app::b': {
        elem: 'def',
        var: 'ref',
        name: 'app::b',
        vis: 'priv',
        body: {
          elem: 'exp',
          var: 'eval',
          fun: { elem: 'exp', var: 'ref', name: 'app::a' },
          arg: { elem: 'exp', var: 'ref', name: 'core::lang::then' },
        },
      },
      'app::main': {
        elem: 'def',
        var: 'ref',
        name: 'app::main',
        vis: 'pub',
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            name: 'core::lang::Fun',
            params: [
              { elem: 'type', name: 'std::sys::Proc', params: [] },
              { elem: 'type', name: 'std::sys::Exit', params: [] },
            ]
          },
          arg: {
            elem: 'def',
            var: 'arg',
            name: 'p',
            type: { elem: 'type', name: 'std::sys::Proc', params: [] },
          },
          body: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'std::sys::Exit', params: [] },
            name: 'Ok',
          },
          ctx: {
            p: {
              elem: 'def',
              var: 'arg',
              name: 'p',
              type: { elem: 'type', name: 'std::sys::Proc', params: [] },
            }
          },
        },
      },
    });
  });

  it('indexes ref definition of eval of cons', () => {
    const code = 'T = A T; a = T::A T::A;';
    const ast = Frontend.parse(code);

    const result = index(ast);

    expect(result).toStrictEqual({
      'app::T': {
        elem: 'def',
        var: 'type',
        name: 'app::T',
        params: [],
        vis: 'priv',
        body: [
          {
            elem: 'cons',
            name: 'A',
            arg: { elem: 'type', name: 'app::T', params: [] },
          },
        ],
      },
      'app::a': {
        elem: 'def',
        var: 'ref',
        name: 'app::a',
        vis: 'priv',
        body: {
          elem: 'exp',
          var: 'eval',
          fun: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'app::T', params: [] },
            name: 'A',
          },
          arg: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'app::T', params: [] },
            name: 'A',
          },
        },
      },
      'app::main': {
        elem: 'def',
        var: 'ref',
        name: 'app::main',
        vis: 'pub',
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            name: 'core::lang::Fun',
            params: [
              { elem: 'type', name: 'std::sys::Proc', params: [] },
              { elem: 'type', name: 'std::sys::Exit', params: [] },
            ]
          },
          arg: {
            elem: 'def',
            var: 'arg',
            name: 'p',
            type: { elem: 'type', name: 'std::sys::Proc', params: [] },
          },
          body: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'std::sys::Exit', params: [] },
            name: 'Ok',
          },
          ctx: {
            p: {
              elem: 'def',
              var: 'arg',
              name: 'p',
              type: { elem: 'type', name: 'std::sys::Proc', params: [] },
            }
          },
        },
      },
    });
  });

  it('indexes ref definition of fun', () => {
    const code = 'Type1<U> = C U; Type2 = C; f = a: Type1<Type2> -> Type1<Type2> a;';
    const ast = Frontend.parse(code);

    const result = index(ast);

    expect(result).toStrictEqual({
      'app::Type1': {
        elem: 'def',
        var: 'type',
        name: 'app::Type1',
        params: [
          { elem: 'type', name: 'U', params: [] },
        ],
        vis: 'priv',
        body: [
          {
            elem: 'cons',
            name: 'C',
            arg: { elem: 'type', name: 'U', params: [] },
          },
        ],
      },
      'app::Type2': {
        elem: 'def',
        var: 'type',
        name: 'app::Type2',
        params: [],
        vis: 'priv',
        body: [{ elem: 'cons', name: 'C', arg: null }],
      },
      'app::f': {
        elem: 'def',
        var: 'ref',
        name: 'app::f',
        vis: 'priv',
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            name: 'core::lang::Fun',
            params: [
              {
                elem: 'type',
                name: 'app::Type1',
                params: [{ elem: 'type', name: 'app::Type2', params: [] }],
              },
              {
                elem: 'type',
                name: 'app::Type1',
                params: [{ elem: 'type', name: 'app::Type2', params: [] }],
              },
            ],
          },
          arg: {
            elem: 'def',
            var: 'arg',
            name: 'a',
            type: {
              elem: 'type',
              name: 'app::Type1',
              params: [{ elem: 'type', name: 'app::Type2', params: [] }],
            },
          },
          body: {
            elem: 'exp',
            var: 'ref',
            name: 'app::a',
          },
          ctx: {
            a: {
              elem: 'def',
              var: 'arg',
              name: 'a',
              type: {
                elem: 'type',
                name: 'app::Type1',
                params: [{ elem: 'type', name: 'app::Type2', params: [] }],
              },
            },
          },
        },
      },
      'app::main': {
        elem: 'def',
        var: 'ref',
        name: 'app::main',
        vis: 'pub',
        body: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            name: 'core::lang::Fun',
            params: [
              { elem: 'type', name: 'std::sys::Proc', params: [] },
              { elem: 'type', name: 'std::sys::Exit', params: [] },
            ]
          },
          arg: {
            elem: 'def',
            var: 'arg',
            name: 'p',
            type: { elem: 'type', name: 'std::sys::Proc', params: [] },
          },
          body: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'std::sys::Exit', params: [] },
            name: 'Ok',
          },
          ctx: {
            p: {
              elem: 'def',
              var: 'arg',
              name: 'p',
              type: { elem: 'type', name: 'std::sys::Proc', params: [] },
            },
          },
        },
      },
    });
  });
});

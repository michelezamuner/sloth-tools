const Frontend = require('../src/frontends/anath/frontend');
const Compiler = require('../src/compiler');

describe('compiler', () => {
  it('compiles an ast into an index', () => {
    const code = 'T = C; T::C;';
    const ast = Frontend.parse(code);

    const index = Compiler.compile(ast);

    expect(index).toStrictEqual({
      'app::T': {
        elem: 'def',
        var: 'type',
        name: 'app::T',
        params: [],
        vis: 'priv',
        body: [{ elem: 'cons', name: 'C', arg: null }],
      },
      'app::main': {
        elem: 'def',
        var: 'ref',
        name: 'app::main',
        vis: 'pub',
        type: {
          elem: 'type',
          name: 'core::lang::Fun',
          params: [
            { elem: 'type', name: 'std::sys::Proc', params: [] },
            { elem: 'type', name: 'std::sys::Exit', params: [] },
          ],
        },
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
            var: 'eval',
            fun: {
              elem: 'exp',
              var: 'eval',
              fun: { elem: 'exp', var: 'ref', name: 'core::lang::then' },
              arg: {
                elem: 'exp',
                var: 'eval',
                fun: { elem: 'exp', var: 'ref', name: 'core::lang::debug' },
                arg: {
                  elem: 'exp',
                  var: 'cons',
                  type: { elem: 'type', name: 'app::T', params: [] },
                  name: 'C',
                },
              },
            },
            arg: {
              elem: 'exp',
              var: 'cons',
              type: { elem: 'type', name: 'std::sys::Exit', params: [] },
              name: 'Ok',
            },
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

const Frontend = require('../../../src/frontends/anath/frontend');

describe('anath frontend', () => {
  it('parses code', () => {
    const code = 'T = A; T::A;';

    const ast = Frontend.parse(code);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'mod',
      name: 'app',
      vis: 'pub',
      body: [
        {
          elem: 'def',
          var: 'type',
          name: 'T',
          params: [],
          vis: 'priv',
          body: [{ elem: 'cons', name: 'A', arg: null }],
        },
        {
          elem: 'def',
          var: 'ref',
          name: 'main',
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
              ],
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
                    type: { elem: 'type', name: 'T', params: [] },
                    name: 'A',
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
          },
        },
      ],
    });
  });
});

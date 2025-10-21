const Frontend = require('../../../src/frontends/enlil/frontend');

describe('enlil frontend', () => {
  it('parses enlil code', () => {
    const code = `
      enum T { A }
      T::A
    `;
    const config = {
      mod: 'm',
      main: 'm',
      proc: 'p',
    };

    const ast = Frontend.parse(code, config);

    expect(ast).toStrictEqual({
      elem: 'mod',
      id: 'm',
      body: [
        {
          elem: 'def',
          var: 'enum',
          id: 'T',
          vis: 'priv',
          body: [{
            elem: 'cons',
            id: 'A',
            type: { elem: 'type', id: 'T', var: 'id' },
          }],
        },
        {
          elem: 'def',
          var: 'ref',
          id: 'm',
          vis: 'priv',
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [{ elem: 'type', var: 'id', id: '::core::sys::Process' }],
              ret: { elem: 'type', var: 'id', id: '::core::sys::Exit' },
            },
            args: [{
              elem: 'pat',
              var: 'id',
              id: 'p',
              type: { elem: 'type', var: 'id', id: '::core::sys::Process' },
            }],
            body: {
              elem: 'exp',
              var: 'eval',
              fun: {
                elem: 'exp',
                var: 'id',
                id: '::core::lang::then',
              },
              args: [
                {
                  elem: 'exp',
                  var: 'eval',
                  fun: {
                    elem: 'exp',
                    var: 'id',
                    id: '::core::lang::debug',
                  },
                  args: [
                    {
                      elem: 'exp',
                      var: 'enum',
                      type: { elem: 'type', var: 'id', id: 'T' },
                      body: {
                        elem: 'cons',
                        id: 'A',
                        type: { elem: 'type', id: 'T', var: 'id' },
                      },
                    },
                  ],
                },
                {
                  elem: 'exp',
                  var: 'enum',
                  type: { elem: 'type', var: 'id', id: '::core::sys::Exit' },
                  body: {
                    elem: 'cons',
                    id: 'OK',
                    type: { elem: 'type', id: '::core::sys::Exit', var: 'id' },
                  },
                },
              ],
            },
          },
        },
      ],
    });
  });
});

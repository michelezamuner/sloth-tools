const Frontend = require('../../src/frontends/anath/frontend');
const Indexer = require('../../src/compiler/indexer');
const Typer = require('../../src/compiler/typer');

describe('typer', () => {
  it('type cons exp', () => {
    const code = 'T = C; a = T::C;';
    const ast = Frontend.parse(code);
    const index = Indexer.index(ast);

    const result = Typer.type(index);

    expect(result).toStrictEqual({
      'app::T': {
        elem: 'def',
        var: 'type',
        name: 'app::T',
        params: [],
        vis: 'priv',
        body: [{ elem: 'cons', name: 'C', arg: null }],
      },
      'app::a': {
        elem: 'def',
        var: 'ref',
        name: 'app::a',
        vis: 'priv',
        type: { elem: 'type', name: 'app::T', params: [] },
        body: {
          elem: 'exp',
          var: 'cons',
          type: { elem: 'type', name: 'app::T', params: [] },
          name: 'C',
        },
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

  it('type eval exp', () => {
    const code = 'T = C; a = ! T::C;';
    const ast = Frontend.parse(code);
    const index = Indexer.index(ast);

    const result = Typer.type(index);

    expect(result).toStrictEqual({
      'app::T': {
        elem: 'def',
        var: 'type',
        name: 'app::T',
        params: [],
        vis: 'priv',
        body: [{ elem: 'cons', name: 'C', arg: null }],
      },
      'app::a': {
        elem: 'def',
        var: 'ref',
        name: 'app::a',
        vis: 'priv',
        type: { elem: 'type', name: 'app::T', params: [] },
        body: {
          elem: 'exp',
          var: 'eval',
          type: { elem: 'type', name: 'app::T', params: [] },
          fun: {
            elem: 'exp',
            var: 'ref',
            name: 'core::lang::debug',
            type: {
              elem: 'type',
              name: 'core::lang::Fun',
              params: [
                {elem: 'type', name: '<T>', params: []},
                {elem: 'type', name: '<T>', params: []},
              ],
            },
          },
          arg: {
            elem: 'exp',
            var: 'cons',
            type: { elem: 'type', name: 'app::T', params: [] },
            name: 'C',
          },
        },
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
});

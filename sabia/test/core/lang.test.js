const { debug } = require('../../src/core/lang');

describe('lang', () => {
  it('prints debug representation of enum expression', () => {
    let written = undefined;
    const runtime = {
      process: {
        stdout: {
          write: msg => { written = msg; },
        },
      },
    };
    const ast = {
      elem: 'exp',
      var: 'cons',
      type: { elem: 'type', name: 'T', params: [] },
      name: 'A',
    };

    debug(runtime, ast);

    expect(written).toBe('[T] A\n');
  });
});

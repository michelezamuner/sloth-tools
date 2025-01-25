const { debug } = require('../../src/core/lang');

describe('lang', () => {
  it('prints debug representation of identity expression', () => {
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
      var: 'id',
      type: { elem: 'type', var: 'id', id: 'T' },
      id: 'A',
    };

    debug(runtime, [ast]);

    expect(written).toBe('[T] A\n');
  });
});

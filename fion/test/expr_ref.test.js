const expr = require('../src/expr');

describe('ref', () => {
  it('creates reference expression', () => {
    const ref = expr.create(['REF', '0x12']);

    expect(ref).toStrictEqual({ type: expr.REF, id: '0x12' });
  });
});

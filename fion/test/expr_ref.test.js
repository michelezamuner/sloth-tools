const expr = require('../src/expr');

describe('ref', () => {
  it('creates reference expression', () => {
    const ref = expr.create(expr.REF, '0');

    expect(ref).toStrictEqual({
      type: expr.REF,
      id: '0',
    });
  });
});

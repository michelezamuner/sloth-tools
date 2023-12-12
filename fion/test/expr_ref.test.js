const expr = require('../src/expr');

describe('ref', () => {
  const ref = expr.create(expr.REF, '0');

  it('provides type of expressions', () => {
    expect(expr.type(ref)).toBe(expr.REF);
  });

  it('provides identifier of reference expressions', () => {
    expect(expr.ref.id(ref)).toBe('0');
  });
});

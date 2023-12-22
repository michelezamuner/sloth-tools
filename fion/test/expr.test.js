const expr = require('../src/expr');

describe('expr', () => {
  it('creates byte expression', () => {
    const ref = expr.create(['BYTE', 0x12]);

    expect(ref).toStrictEqual({ type: expr.BYTE, val: Buffer.from([0x12]) });
  });

  it('creates increment expression from dsl', () => {
    const incr = expr.create(['INCR', ['BYTE', 0x12]]);

    expect(incr).toStrictEqual({
      type: expr.INCR,
      expr: { type: expr.BYTE, val: Buffer.from([0x12]) },
    });
  });

  it('creates increment expression from ast', () => {
    const byte = expr.create(['BYTE', 0x12]);
    const incr = expr.create(['INCR', byte]);

    expect(incr).toStrictEqual({
      type: expr.INCR,
      expr: { type: expr.BYTE, val: Buffer.from([0x12]) },
    });
  });

  it('errors on invalid expression', () => {
    expect(() => expr.create(['INVALID'])).toThrow('Invalid expression \'INVALID\'');
  });
});

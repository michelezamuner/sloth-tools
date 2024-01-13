const expr = require('../src/expr');

describe('expr', () => {
  it('creates byte', () => {
    const e = expr.create(['BYTE', 0x12]);

    expect(e).toStrictEqual({ type: expr.BYTE, val: Buffer.from([0x12]) });
  });

  it('creates reference', () => {
    const e = expr.create(['REF', 'ref']);

    expect(e).toStrictEqual({ type: expr.REF, ref: 'ref' });
  });

  it('creates native reference', () => {
    const e = expr.create(['REF', 'INCR']);

    expect(e).toStrictEqual({ type: expr.REF, ref: 'INCR' });
  });

  it('creates variable', () => {
    const e = expr.create(['VAR', 'a']);

    expect(e).toStrictEqual({ type: expr.VAR, var: 'a' });
  });

  it('errors on invalid native reference', () => {
    expect(() => expr.create(['REF', 'INVALID'])).toThrow('Invalid native reference \'INVALID\'');
  });

  it('creates fun call', () => {
    const eDsl = expr.create(['CALL', ['REF', 'fun'], ['BYTE', 0x12]]);
    const ref = expr.create(['REF', 'fun']);
    const byte = expr.create(['BYTE', 0x12]);
    const eAst = expr.create(['CALL', ref, byte]);
    const expected = {
      type: expr.CALL,
      fun: { type: expr.REF, ref: 'fun' },
      args: [{ type: expr.BYTE, val: Buffer.from([0x12]) }],
    };

    expect(eDsl).toStrictEqual(expected);
    expect(eAst).toStrictEqual(expected);
  });

  it('errors on invalid expression', () => {
    expect(() => expr.create(['INVALID'])).toThrow('Invalid expression \'INVALID\'');
  });

  it('errors on expression with invalid format', () => {
    expect(() => expr.create([[]])).toThrow('Invalid expression: first element must be expression type, found \'[]\'');
  });
});

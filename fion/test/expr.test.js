const Expr = require('../src/expr');

describe('expr', () => {
  it('creates byte', () => {
    const expr = Expr.create(['BYTE', 0x12]);

    expect(expr).toStrictEqual({ type: Expr.BYTE, val: Buffer.from([0x12]) });
  });

  it('creates reference', () => {
    const expr = Expr.create(['REF', 'ref']);

    expect(expr).toStrictEqual({ type: Expr.REF, ref: 'ref' });
  });

  it('creates native reference', () => {
    const expr = Expr.create(['REF', 'INCR']);

    expect(expr).toStrictEqual({ type: Expr.REF, ref: 'INCR' });
  });

  it('creates variable', () => {
    const expr = Expr.create(['VAR', 'a']);

    expect(expr).toStrictEqual({ type: Expr.VAR, var: 'a' });
  });

  it('errors on invalid native reference', () => {
    expect(() => Expr.create(['REF', 'INVALID'])).toThrow('Invalid native reference \'INVALID\'');
  });

  it('creates fun call', () => {
    const exprDsl = Expr.create(['CALL', ['REF', 'fun'], ['BYTE', 0x12]]);
    const ref = Expr.create(['REF', 'fun']);
    const byte = Expr.create(['BYTE', 0x12]);
    const eAst = Expr.create(['CALL', ref, byte]);
    const expected = {
      type: Expr.CALL,
      fun: { type: Expr.REF, ref: 'fun' },
      args: [{ type: Expr.BYTE, val: Buffer.from([0x12]) }],
    };

    expect(exprDsl).toStrictEqual(expected);
    expect(eAst).toStrictEqual(expected);
  });

  it('errors on invalid expression', () => {
    expect(() => Expr.create(['INVALID'])).toThrow('Invalid expression \'INVALID\'');
  });

  it('errors on expression with invalid format', () => {
    expect(() => Expr.create([[]])).toThrow('Invalid expression: first element must be expression type, found \'[]\'');
  });
});

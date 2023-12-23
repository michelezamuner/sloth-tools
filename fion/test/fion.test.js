const { ast, expr, stmt } = require('../src/lib');

describe('fion', () => {
  it('generates an AST representing a function returning an expression', () => {
    const a = ast.create({ 'main': { 'RET': ['CALL', ['REF', 'core.incr'], ['BYTE', 0x12]] } });

    expect(a).toStrictEqual({
      funs: [
        {
          name: 'main',
          stmts: [
            {
              type: stmt.RET,
              expr: {
                type: expr.CALL,
                fun: { type: expr.REF, ref: 'core.incr' },
                args: [{ type: expr.BYTE, val: Buffer.from([0x12]) }],
              },
            },
          ],
        },
      ],
    });
  });
});

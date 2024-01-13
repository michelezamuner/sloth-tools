const { Ast, Expr, Stmt } = require('../src/lib');

describe('fion', () => {
  it('generates an AST representing a function returning an expression', () => {
    const ast = Ast.create([['main', [['RET', ['CALL', ['REF', 'core.incr'], ['BYTE', 0x12]]]]]]);

    expect(ast).toStrictEqual({
      funs: [
        {
          name: 'main',
          stmts: [
            {
              type: Stmt.RET,
              expr: {
                type: Expr.CALL,
                fun: { type: Expr.REF, ref: 'core.incr' },
                args: [{ type: Expr.BYTE, val: Buffer.from([0x12]) }],
              },
            },
          ],
        },
      ],
    });
  });
});

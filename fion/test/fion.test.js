const { ast, expr, stmt } = require('../src/lib');

describe('fion', () => {
  it('generates an AST representing a function returning a constant value', () => {
    const a = ast.create({ 'main': { 'RET': [ 'BYTE', 0x12 ] } });

    expect(a).toStrictEqual({
      funs: [
        {
          name: 'main',
          stmts: [
            {
              type: stmt.RET,
              expr: { type: expr.BYTE, val: Buffer.from([0x12]) },
            },
          ],
        },
      ],
    });
  });
});
